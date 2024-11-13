import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { InvoicesService } from './invoices.service';
import { invoiceRoutes } from 'src/routes/invoices.routes';
import { GetUser } from '../helpers/request.helpers';
import { User } from '../models/User.model';

@Controller(invoiceRoutes.main)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post(invoiceRoutes.createNewInvoice)
  @UseGuards(JwtAuthGuard)
  async createInvoice(@GetUser() user: User) {
    return await this.invoicesService.createInvoice(user);
  }

  @Post(invoiceRoutes.setPaidId)
  async setPaid(@Param('id') invoiceId: string) {
    return await this.invoicesService.setPaid(invoiceId);
  }
}
