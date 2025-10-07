import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user.
   * @param username User's username.
   * @param pass User's password.
   * @returns Validated user or null.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Logs in a user and returns JWT.
   * @param user User data.
   * @returns Access token.
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a new user.
   * @param username Username.
   * @param password Password.
   * @returns Created user.
   */
  async register(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.create({ username, password: hashed });
  }
}