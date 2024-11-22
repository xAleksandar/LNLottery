import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'auth_identifier',
    });
  }

  async validate(email: string, auth_identifier: string) {
    const user = await this.authService.validateUser({
      email,
      auth_identifier,
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
