import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './auth.service';
import { authPaths } from './paths/auth.paths';
import { Request } from 'express';
import { Body, HttpCode, HttpStatus } from '@nestjs/common';
import { User } from '../models/User.model';

@Controller(authPaths.main)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(authPaths.login)
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    const user = req.user as User;
    const tokens = await this.authService.generateInitialTokens(user);
    return tokens;
  }

  @Post(authPaths.refreshToken)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const payload = await this.authService.validateRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const accessToken = await this.authService.generateAccessToken(payload);
    return { accessToken };
  }

  @Get(authPaths.status)
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
}
