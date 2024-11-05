import * as mongoose from 'mongoose';
import { PaymentStatus } from 'src/enums/payments.enum';

export const PaymentSchema = new mongoose.Schema({
  payment_hash: { type: String, required: true },
  payment_request: { type: String, required: true },
  lnurl_response: { type: String },
  checking_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  status: { type: PaymentStatus, required: true },
});

export interface Payment {
  id: string;
  payment_hash: string;
  payment_request: string;
  lnurl_response: string;
  checking_id: string;
  created_at: Date;
  status: PaymentStatus;
}
