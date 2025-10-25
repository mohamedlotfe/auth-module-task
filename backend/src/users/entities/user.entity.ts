import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @Column('array')
  roles: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
