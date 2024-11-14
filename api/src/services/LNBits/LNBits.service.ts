import axios from 'axios';
import { LNBitsHeaders } from './LNBits.headers';
import { CREATE_INVOICE_URL } from './LNBits.urls';
import { Deposit } from '../../models/Deposit.model';

export const makeDeposit = async (
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
    return response.data as Deposit;
  } catch (error) {
    console.error('Error making deposit: ', error);
  }
};
