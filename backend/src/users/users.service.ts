import { Injectable, ConflictException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string | ObjectId): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      passwordHash: createUserDto.passwordHash,
      roles: createUserDto.roles || ['user'],
    });

    return user;
  }

  emailExists(email: string): Promise<boolean> {
    return this.usersRepository.emailExists(email);
  }
}
