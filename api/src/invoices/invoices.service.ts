import { Injectable, NotFoundException } from '@nestjs/common';
import { makePayment } from '../services/LNBits/LNBits.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Messages } from 'src/messages';
import { Payment } from '../models/Payment.model';
import { MongoModels } from '../models/models.enum';
import { invoiceRoutes } from 'src/routes/invoices.routes';
import { getInvoiceDate } from 'src/helpers/date.helpers';
import { PaymentStatus } from 'src/enums/payments.enum';
import { User } from '../models/User.model';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(MongoModels.Payment)
    private readonly depositModel: Model<Payment>,
    @InjectModel(MongoModels.User) private readonly userModel: Model<User>,
  ) {}

  async createDepositInvoice(user: User) {
    const amount = 10; //TODO: Replace with user data when user call implemented
    const currentDate = new Date();
    const expiryDate =
      currentDate.getTime() + Number(process.env.LNBITS_INVOICE_EXPIRY);
    const payment = new this.depositModel({
      user_id: user.id,
      amount,
      payment_hash: 'payment_hash',
      payment_request: 'payment_request',
      lnurl_response: 'lnurl_response',
      checking_id: 'checking_id',
      created_at: currentDate,
      status: PaymentStatus.CREATED,
    });

    const paymentMemo = `${getInvoiceDate(currentDate)} || ${user.username} || ${amount} sats`;

    const request = await makePayment(
      amount,
      paymentMemo,
      expiryDate,
      `${process.env.SERVER_BASE_URL}/${invoiceRoutes.main}${invoiceRoutes.setPaid}/${payment.id}`,
    );

    payment.payment_hash = request.payment_hash;
    payment.payment_request = request.payment_request;
    payment.lnurl_response = request.lnurl_response;
    payment.checking_id = request.checking_id;
    payment.status = PaymentStatus.PENDING;

    const result = await payment.save();

    return result;
  }

  async setPaid(invoiceId: string) {
    const payment = await this.depositModel.findById(invoiceId);

    if (!payment) {
      return new NotFoundException(Messages.commonPaymentNotFound());
    }

    const user = await this.userModel.findById(payment.user_id);

    if (!user) {
      return new NotFoundException(Messages.commonUserNotFound());
    }

    user.balance += payment.amount;
    await user.save();

    payment.status = PaymentStatus.COMPLETED;
    const result = await payment.save();

    return result;
  }
}
