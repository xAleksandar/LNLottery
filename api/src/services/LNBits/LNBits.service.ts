import axios from 'axios';
import { LNBitsHeaders } from './LNBits.headers';
import { CREATE_INVOICE_URL } from './LNBits.urls';

export const makePayment = async (amount: number, memo: string) => {
  try {
    const response = await axios.post(
      CREATE_INVOICE_URL,
      { out: false, amount, memo },
      LNBitsHeaders,
    );
    console.log('Payment response:', response.data);
  } catch (error) {
    console.error('Error making payment:', error);
  }
};
