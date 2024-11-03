import { Injectable } from '@nestjs/common';
import { makePayment } from '../services/LNBits/LNBits.service';

@Injectable()
export class InvoicesService {
  async createInvoice() {
    return await makePayment(100, 'Payment memo');
  }
}
