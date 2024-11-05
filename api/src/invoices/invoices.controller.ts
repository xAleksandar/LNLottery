import { Get, Controller, Post, Param } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { invoiceRoutes } from 'src/routes/invoices.routes';

@Controller(invoiceRoutes.main)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async createInvoice() {
    return await this.invoicesService.createInvoice();
  }

  @Post(invoiceRoutes.setPaidId)
  async setPaid(@Param('id') invoiceId: string) {
    return await this.invoicesService.setPaid(invoiceId);
  }
}
