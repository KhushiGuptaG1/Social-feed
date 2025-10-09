import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  async findById(id: number): Promise<User> {
    return this.repo.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return this.repo.findOneBy({ username });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.repo.save(user);
  }
}