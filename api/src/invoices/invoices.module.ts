import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../models/User.model';
import { MongoModels } from '../models/models.enum';
import { DepositSchema } from '../models/Deposit.model';
import { WithdrawalSchema } from 'src/models/Withdrawal.model';
import { GatewayModule } from 'src/gateway/gateway.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoModels.User, schema: UserSchema },
      { name: MongoModels.Deposit, schema: DepositSchema },
      { name: MongoModels.Withdrawal, schema: WithdrawalSchema },
    ]),
    UsersModule,
    GatewayModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
