import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TokensTypeEnum } from 'src/enums/tokens.enum';
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { authPaths } from './paths/auth.paths';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { Messages } from '../messages';

@Controller(authPaths.main)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(authPaths.login)
  @UseGuards(LocalGuard)
  async login(@Req() request: Request, @Res() response: Response) {
    const user = request.user as User;
    const tokens = await this.authService.generateInitialTokens(user);

    console.log(tokens);

    console.log(Number(process.env.ACCESS_TOKEN_EXPIRY));
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

  @Get(authPaths.status)
  @UseGuards(JwtAuthGuard)
  status(@Res() response: Response) {
    return response.status(200).json({ message: Messages.commonTokenActive() });
  }
}
