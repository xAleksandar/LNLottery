import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}
