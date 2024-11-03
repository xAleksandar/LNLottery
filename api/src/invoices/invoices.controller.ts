import { Get, Controller } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async createInvoice() {
    return await this.invoicesService.createInvoice();
  }
}
