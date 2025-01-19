import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoModels } from 'src/models/models.enum';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../models/User.model';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class VerifyEmailGuard implements CanActivate {
  constructor(
    @InjectModel(MongoModels.User) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Allow bypassing email verification for the `/auth/verify-email` endpoint
    if (
      (request.path.includes('/auth/') &&
        !request.path.includes('/auth/status')) ||
      request.path.includes('/users/create-new-user')
    ) {
      return true;
    }

    try {
      const token = request.cookies?.accessToken;
      if (!token) throw new UnauthorizedException('No access token');

      const payload = this.jwtService.verify(token);
      if (!payload?.id) throw new UnauthorizedException('Invalid token');

      const user = await this.userModel.findById(payload.id).exec();
      if (!user) throw new UnauthorizedException('User not found');

      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Email not verified');
      }

      request['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
