require('dotenv').config();

export const LNBitsHeaders = {
  headers: {
    'X-Api-Key': process.env.LNBITS_API_KEY,
    'Content-type': 'application/json',
  },
};
