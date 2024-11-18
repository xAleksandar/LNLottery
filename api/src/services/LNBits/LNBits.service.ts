import axios from 'axios';
import { LNBitsHeaders } from './LNBits.headers';
import { CREATE_INVOICE_URL, CREATE_WITHDRAWAL_URL } from './LNBits.urls';
import { Withdrawal } from 'src/models/Withdrawal.model';
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

export const makeWithdrawal = async (
  title: string,
  amount: number,
  webhook_url: string,
) => {
  try {
    const response = await axios.post(
      CREATE_WITHDRAWAL_URL,
      {
        title,
        min_withdrawable: amount,
        max_withdrawable: amount,
        is_unique: true,
        uses: 1,
        wait_time: 1,
        webhook_url,
      },
      LNBitsHeaders,
    );
    return response.data;
  } catch (error) {
    console.error('Error making deposit: ', error);
  }
};
