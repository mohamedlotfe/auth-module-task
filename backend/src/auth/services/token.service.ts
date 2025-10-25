import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { AccessTokenPayload, RefreshTokenPayload } from '../interfaces';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async generateTokenPair(user: {
    _id: ObjectId;
    email: string;
    roles: string[];
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken(
      user._id.toString(),
      user.email,
      user.roles,
    );
    const { token: refreshToken, tokenId } = this.generateRefreshToken(
      user._id.toString(),
    );

    const refreshExpiration = new Date();
    refreshExpiration.setDate(
      refreshExpiration.getDate() +
        this.parseExpirationToDays(
          this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
        ),
    );

    await this.refreshTokenRepository.createToken(
      user._id,
      tokenId,
      refreshExpiration,
    );

    return { accessToken, refreshToken };
  }

  generateAccessToken(userId: string, email: string, roles: string[]): string {
    const payload: AccessTokenPayload = { userId, email, roles };
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET') || '';
    const expiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m';
    return this.jwtService.sign<AccessTokenPayload>(payload, {
      secret,
      expiresIn: parseInt(expiresIn, 10),
    });
  }

  generateRefreshToken(userId: string): {
    token: string;
    tokenId: string;
  } {
    const tokenId = uuidv4();
    const payload: RefreshTokenPayload = { userId, tokenId };
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET') || '';
    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const token = this.jwtService.sign<RefreshTokenPayload>(payload, {
      secret,
      expiresIn: parseInt(expiresIn, 10),
    });

    return { token, tokenId };
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    const payload = this.jwtService.verify<RefreshTokenPayload>(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    return payload;
  }

  private parseExpirationToDays(expiration: string): number {
    const match = expiration.match(/^(\d+)d$/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 7;
  }
}
