import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  balance: { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
});

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  balance: number;
  isEmailVerified: boolean;
}
