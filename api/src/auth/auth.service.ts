import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { MongoModels } from 'src/models/models.enum';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/User.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(MongoModels.User) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(user: User) {
    const payload = { username: user.username, id: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRY,
    });
  }

  async generateInitialTokens(user: User) {
    const payload = { username: user.username, id: user.id };
    const accessToken = await this.generateAccessToken(user);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRY,
    });
    return { accessToken, refreshToken };
  }

  async validateUser(payload: AuthPayloadDto) {
    const { email, auth_identifier } = payload;
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      auth_identifier,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async loginUser(user: User) {
    const tokens = await this.generateInitialTokens(user);
    return tokens;
  }

  async verifyEmail(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return false;
    }

    user.isEmailVerified = true;
    await user.save();
    return true;
  }
}
