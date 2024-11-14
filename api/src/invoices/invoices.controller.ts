import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { InvoicesService } from './invoices.service';
import { invoiceRoutes } from 'src/routes/invoices.routes';
import { GetUser } from '../helpers/request.helpers';
import { User } from '../models/User.model';

@Controller(invoiceRoutes.main)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post(invoiceRoutes.createDepositInvoice)
  @UseGuards(JwtAuthGuard)
  async createDepositInvoice(@GetUser() user: User) {
    return await this.invoicesService.createDepositInvoice(user);
  }

  @Post(invoiceRoutes.setPaidId)
  async setPaid(@Param('id') invoiceId: string) {
    return await this.invoicesService.setPaid(invoiceId);
  }
}
