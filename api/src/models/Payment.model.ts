import * as mongoose from 'mongoose';
import { PaymentStatus } from 'src/enums/payments.enum';

export const PaymentSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  amount: { type: Number, required: true },
  payment_hash: { type: String, required: true },
  payment_request: { type: String, required: true },
  lnurl_response: { type: String },
  checking_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  status: { type: String, required: true },
});

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  payment_hash: string;
  payment_request: string;
  lnurl_response: string;
  checking_id: string;
  created_at: Date;
  status: PaymentStatus;
}
