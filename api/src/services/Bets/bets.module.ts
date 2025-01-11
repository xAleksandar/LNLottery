import { Module } from '@nestjs/common';
import { BetsService } from './bets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../models/User.model';
import { MongoModels } from 'src/models/models.enum';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MongoModels.User, schema: UserSchema }]),
  ],
  providers: [BetsService],
  exports: [BetsService],
})
export class BetsModule {}
