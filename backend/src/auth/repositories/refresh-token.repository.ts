import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { RefreshToken } from '../entities/refresh-token.entity';
import { MongoBaseRepository } from '../../common/database/mongo-base-repository';

@Injectable()
export class RefreshTokenRepository extends MongoBaseRepository<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: MongoRepository<RefreshToken>,
  ) {
    super(refreshTokenRepository);
  }

  findBy(tokenId: string): Promise<RefreshToken | null> {
    return this.findOne({ tokenId } as Partial<RefreshToken>);
  }

  async deleteBy(tokenId: string): Promise<boolean> {
    const token = await this.findBy(tokenId);
    if (!token) {
      return false;
    }
    return this.delete(token._id);
  }

  async deleteByUserId(userId: string | ObjectId): Promise<number> {
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const tokens = await this.findMany({
      userId: objectId,
    } as Partial<RefreshToken>);

    let deletedCount = 0;
    for (const token of tokens) {
      const deleted = await this.delete(token._id);
      if (deleted) {
        deletedCount++;
      }
    }

    return deletedCount;
  }

  createToken(
    userId: ObjectId,
    tokenId: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    return this.create({ userId, tokenId, expiresAt });
  }

  async isTokenValid(tokenId: string): Promise<boolean> {
    const token = await this.findBy(tokenId);
    if (!token) {
      return false;
    }

    return token.expiresAt > new Date();
  }

  async cleanExpiredTokens(): Promise<number> {
    const expiredTokens = await this.refreshTokenRepository.find({
      where: {
        expiresAt: { $lt: new Date() },
      },
    });

    let deletedCount = 0;
    for (const token of expiredTokens) {
      const deleted = await this.delete(token._id);
      if (deleted) {
        deletedCount++;
      }
    }

    return deletedCount;
  }
}
