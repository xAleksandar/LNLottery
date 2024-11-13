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

  validate(email: string, auth_identifier: string) {
    const user = this.authService.validateUser({ email, auth_identifier });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
