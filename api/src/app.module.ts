import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesModule } from './invoices/invoices.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MongoModels } from './models/models.enum';
import { UserSchema } from './models/User.model';
import { AuthModule } from './auth/auth.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    AuthModule,
    InvoicesModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: MongoModels.User, schema: UserSchema }]),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
