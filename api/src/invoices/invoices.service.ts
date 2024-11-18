import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { makeDeposit, makeWithdrawal } from '../services/LNBits/LNBits.service';
import { WithdrawalRequest } from 'src/types/requests';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Messages } from 'src/messages';
import { Deposit } from '../models/Deposit.model';
import { MongoModels } from '../models/models.enum';
import { invoiceRoutes } from 'src/routes/invoices.routes';
import { getInvoiceDate } from 'src/helpers/date.helpers';
import { Withdrawal } from 'src/models/Withdrawal.model';
import { PaymentStatus } from 'src/enums/payments.enum';
import { User } from '../models/User.model';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(MongoModels.Deposit)
    private readonly depositModel: Model<Deposit>,
    @InjectModel(MongoModels.User) private readonly userModel: Model<User>,
    @InjectModel(MongoModels.Withdrawal)
    private readonly withdrawalModel: Model<Withdrawal>,
  ) {}

  async createDepositInvoice(user: User, amount: number) {
    const currentDate = new Date();
    const expiryDate =
      currentDate.getTime() + Number(process.env.LNBITS_INVOICE_EXPIRY);
    const deposit = new this.depositModel({
      user_id: user.id,
      amount,
      payment_hash: 'payment_hash',
      payment_request: 'payment_request',
      lnurl_response: 'lnurl_response',
      checking_id: 'checking_id',
      created_at: currentDate,
      status: PaymentStatus.CREATED,
    });

    const memo = `${getInvoiceDate(currentDate)} || ${user.username} || ${amount} sats`;

    const request = await makeDeposit(
      amount,
      memo,
      expiryDate,
      `${process.env.SERVER_WEBHOOK_URL}/${invoiceRoutes.main}${invoiceRoutes.setPaid}/${deposit.id}`,
    );

    deposit.payment_hash = request.payment_hash;
    deposit.payment_request = request.payment_request;
    deposit.lnurl_response = request.lnurl_response;
    deposit.checking_id = request.checking_id;
    deposit.status = PaymentStatus.PENDING;

    const result = await deposit.save();

    return result;
  }

  async createWithdrawalInvoice(userId: string, data: WithdrawalRequest) {
    const { amount } = data;
    const isManual = data.isManual ?? false;

    const user = await this.userModel.findById(userId);
    const userBalance = user.balance;

    if (userBalance < amount) {
      return new BadRequestException(Messages.commonInsufficientFunds());
    }

    const currentDate = new Date();
    const memo = `${getInvoiceDate(currentDate)} || ${user.username} || ${amount} sats`;
    const withdrawal = new this.withdrawalModel({
      memo,
      user_id: user.id,
      amount,
      isManual,
      created_at: currentDate,
      lnurl: 'lnurl',
      status: PaymentStatus.CREATED,
    });

    const request = await makeWithdrawal(
      memo,
      amount,
      `${process.env.SERVER_WEBHOOK_URL}/${invoiceRoutes.main}${invoiceRoutes.setPaid}/${withdrawal.id}`,
    );

    if (request) {
      withdrawal.status = PaymentStatus.PENDING;
    }

    await withdrawal.save();

    return request;
  }

  async setPaid(invoiceId: string) {
    const deposit = await this.depositModel.findById(invoiceId);
    const withdrawal = await this.withdrawalModel.findById(invoiceId);

    if (!deposit && !withdrawal) {
      return new NotFoundException(Messages.commonDepositNotFound());
    }

    const action = deposit ?? withdrawal;

    const user = await this.userModel.findById(action.user_id);

    if (!user) {
      return new NotFoundException(Messages.commonUserNotFound());
    }

    user.balance = deposit
      ? user.balance + deposit.amount
      : user.balance - withdrawal.amount;
    await user.save();

    action.status = PaymentStatus.COMPLETED;
    const result = await action.save();

    return result;
  }
}
