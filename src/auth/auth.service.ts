import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string) {
    const userByEmail = await this.userService.findByEmail(email);

    if (!userByEmail) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordMatch = await verify(userByEmail.password, password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.userService.normalize(userByEmail);
  }
}
