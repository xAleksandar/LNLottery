import * as mongoose from 'mongoose';
import { PaymentStatus } from 'src/enums/payments.enum';

export const WithdrawalSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  memo: { type: String, required: true },
  amount: { type: Number, required: true },
  isManual: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  lnurl: { type: String, required: true },
  status: { type: String, required: true },
});

export interface Withdrawal {
  id: string;
  memo: string;
  user_id: string;
  amount: number;
  isManual: boolean;
  created_at: Date;
  lnurl: string;
  status: PaymentStatus;
}
