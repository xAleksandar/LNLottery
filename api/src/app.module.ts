import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesModule } from './invoices/invoices.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MongoModels } from './models/models.enum';
import { UserSchema } from './models/User.model';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { VerifyEmailGuard } from './auth/guards/VerifyEmailGuard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    InvoicesModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: MongoModels.User, schema: UserSchema }]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: VerifyEmailGuard,
    },
  ],
})
export class AppModule {}
