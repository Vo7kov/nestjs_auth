import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtRefreshConfig from 'src/auth/config/jwt-refresh.config';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { JwtPayload } from '../types/JwtPayload';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(jwtRefreshConfig.KEY)
    private readonly refreshJwtConfig: ConfigType<typeof jwtRefreshConfig>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtConfig.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const [, refreshToken] = req.get('authorization').split(' ');
    const userId = payload.sub;

    return this.refreshTokenService.validate(userId, refreshToken);
  }
}
