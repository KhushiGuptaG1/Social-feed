import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) { }

  /**
   * Finds a user by ID.
   * @param id User ID.
   * @returns User.
   */
  findById(id: number) {
    return this.repo.findById(id);
  }

  /**
   * Finds a user by username.
   * @param username Username.
   * @returns User.
   */
  findByUsername(username: string) {
    return this.repo.findByUsername(username);
  }

  /**
   * Creates a user.
   * @param user User data.
   * @returns Created user.
   */
  create(user: Partial<User>) {
    return this.repo.create(user);
  }
}