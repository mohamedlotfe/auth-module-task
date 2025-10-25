import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('refresh_tokens')
export class RefreshToken {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index()
  userId: ObjectId;

  @Column()
  @Index({ unique: true })
  tokenId: string;

  @Column()
  @Index()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
