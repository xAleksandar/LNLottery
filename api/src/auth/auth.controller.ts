import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TokensTypeEnum } from 'src/enums/tokens.enum';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { authPaths } from './paths/auth.paths';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { Messages } from '../../../constants/messages';

@Controller(authPaths.main)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(authPaths.login)
  @UseGuards(LocalGuard)
  async login(@Req() request: Request, @Res() response: Response) {
    const user = request.user as User;
    const tokens = await this.authService.generateInitialTokens(user);

    response.cookie(TokensTypeEnum.AccessToken, tokens.accessToken, {
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY),
      httpOnly: true,
      secure: true,
    });

    response.cookie(TokensTypeEnum.RefreshToken, tokens.refreshToken, {
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRY),
      httpOnly: true,
      secure: true,
    });

    return response
      .status(200)
      .json({ message: Messages.commonLoginSuccess() });
  }

  @Post(authPaths.logout)
  @UseGuards(JwtAuthGuard)
  async logout(@Res() response: Response) {
    response.clearCookie(TokensTypeEnum.AccessToken, {
      httpOnly: true,
      secure: true,
    });

    response.clearCookie(TokensTypeEnum.RefreshToken, {
      httpOnly: true,
      secure: true,
    });

    return response
      .status(200)
      .json({ message: Messages.commonLogoutSuccess() });
  }

  @Get(authPaths.status)
  @UseGuards(JwtAuthGuard)
  status(@Res() response: Response) {
    return response.status(200).json({ message: Messages.commonTokenActive() });
  }
}
