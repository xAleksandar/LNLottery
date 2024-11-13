import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../models/User.model';
import { MongoModels } from '../models/models.enum';
import { PaymentSchema } from '../models/Payment.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoModels.Payment, schema: PaymentSchema },
      { name: MongoModels.User, schema: UserSchema },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
