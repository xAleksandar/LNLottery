require('dotenv').config();

export const CREATE_INVOICE_URL =
  process.env.LNBITS_BASE_URL + '/api/v1/payments';
