import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokensTypeEnum } from '../enums/tokens.enum';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const refreshToken = request.cookies?.refreshToken;
    const accessToken = request.cookies?.accessToken;
    if (refreshToken && !accessToken) {
      const jwtService = new JwtService();
      try {
        const token = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
        ) as { username: string; id: string };
        const payload = { username: token.username, id: token.id };
        const newAccessToken = jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRY,
        });
        request.cookies.accessToken = newAccessToken;
        response.cookie(TokensTypeEnum.AccessToken, newAccessToken, {
          maxAge: Number(process.env.ACCESS_TOKEN_EXPIRY),
          httpOnly: true,
          secure: true,
        });
      } catch (error) {}
    }

    next();
  }
}
