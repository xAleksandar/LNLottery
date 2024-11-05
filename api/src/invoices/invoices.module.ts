import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModels } from '../models/models.enum';
import { PaymentSchema } from '../models/Payment.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoModels.Payment, schema: PaymentSchema },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
