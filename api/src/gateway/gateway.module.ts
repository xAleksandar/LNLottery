import { Module } from '@nestjs/common';
import { Gateway } from './gateway.service';
import { UsersModule } from '../users/users.module';
import { BetsModule } from '../services/Bets/bets.module';

@Module({
  imports: [BetsModule, UsersModule],
  providers: [Gateway],
  exports: [Gateway],
})
export class GatewayModule {}
