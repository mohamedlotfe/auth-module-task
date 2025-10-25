import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';
import { MongoBaseRepository } from '../common/database/mongo-base-repository';

@Injectable()
export class UsersRepository extends MongoBaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
  ) {
    super(usersRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email } as Partial<User>);
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }
}
