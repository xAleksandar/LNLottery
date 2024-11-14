import { Injectable, NotFoundException } from '@nestjs/common';
import { makeDeposit } from '../services/LNBits/LNBits.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Messages } from 'src/messages';
import { Deposit } from '../models/Deposit.model';
import { MongoModels } from '../models/models.enum';
import { invoiceRoutes } from 'src/routes/invoices.routes';
import { getInvoiceDate } from 'src/helpers/date.helpers';
import { PaymentStatus } from 'src/enums/payments.enum';
import { User } from '../models/User.model';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(MongoModels.Deposit)
    private readonly depositModel: Model<Deposit>,
    @InjectModel(MongoModels.User) private readonly userModel: Model<User>,
  ) {}

  async createDepositInvoice(user: User) {
    const amount = 10; //TODO: Replace with user data when user call implemented
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

    console.log(
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

  async setPaid(invoiceId: string) {
    const deposit = await this.depositModel.findById(invoiceId);
    if (!deposit) {
      return new NotFoundException(Messages.commonDepositNotFound());
    }

    const user = await this.userModel.findById(deposit.user_id);

    if (!user) {
      return new NotFoundException(Messages.commonUserNotFound());
    }

    user.balance += deposit.amount;
    await user.save();

    deposit.status = PaymentStatus.COMPLETED;
    const result = await deposit.save();

    return result;
  }
}
