import { Injectable, NotFoundException } from '@nestjs/common';
import { makePayment } from '../services/LNBits/LNBits.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoModels } from '../models/models.enum';
import { Payment } from '../models/Payment.model';
import { invoiceRoutes } from 'src/routes/invoices.routes';
import { Messages } from 'src/messages';
import { PaymentStatus } from 'src/enums/payments.enum';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(MongoModels.Payment)
    private readonly paymentModel: Model<Payment>,
  ) {}

  async createInvoice() {
    const currentDate = new Date();
    const expiryDate =
      currentDate.getTime() + Number(process.env.LNBITS_INVOICE_EXPIRY);
    const payment = new this.paymentModel({
      payment_hash: 'payment_hash',
      payment_request: 'payment_request',
      lnurl_response: 'lnurl_response',
      checking_id: 'checking_id',
      created_at: currentDate,
      status: PaymentStatus.CREATED,
    });

    const request = await makePayment(
      10, //TODO: Replace with user data when user call implemented
      'Payment memo', //TODO: Replace with user data when user call implemented
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
    const payment = await this.paymentModel.findById(invoiceId);

    if (!payment) {
      return new NotFoundException(Messages.commonPaymentNotFound());
    }

    payment.status = PaymentStatus.PAID;
    const result = await payment.save();

    return result;
  }
}
