import axios from 'axios';
import { LNBitsHeaders } from './LNBits.headers';
import { CREATE_INVOICE_URL } from './LNBits.urls';
import { Payment } from '../../models/Payment.model';

export const makePayment = async (
  amount: number,
  memo: string,
  expiry: number,
  webhook: string,
) => {
  try {
    const response = await axios.post(
      CREATE_INVOICE_URL,
      { out: false, amount, memo, expiry, webhook },
      LNBitsHeaders,
    );
    return response.data as Payment;
  } catch (error) {
    console.error('Error making payment:', error);
  }
};
