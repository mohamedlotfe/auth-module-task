import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AccessTokenPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: (req: Request) => {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'test',
    });
  }

  validate(payload: AccessTokenPayload) {
    if (!payload.userId || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      userId: payload.userId,
      email: payload.email,
      roles: payload.roles || [],
    };
  }
}
