import { Controller, Post, Param, UseGuards, Body } from '@nestjs/common';
import { WithdrawalRequest, DepositRequest } from 'src/types/requests';
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
  async createDepositInvoice(
    @GetUser() user: User,
    @Body() data: DepositRequest,
  ) {
    const { amount } = data;
    return await this.invoicesService.createDepositInvoice(user, amount);
  }

  @Post(invoiceRoutes.createWithdrawalInvoice)
  @UseGuards(JwtAuthGuard)
  async createWithdrawalInvoice(
    @GetUser() user: User,
    @Body() data: WithdrawalRequest,
  ) {
    return await this.invoicesService.createWithdrawalInvoice(user.id, data);
  }

  @Post(invoiceRoutes.setPaidId)
  async setPaid(@Param('id') invoiceId: string) {
    return await this.invoicesService.setPaid(invoiceId);
  }
}
