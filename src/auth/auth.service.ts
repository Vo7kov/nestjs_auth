import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { hash, verify } from 'argon2';
import jwtRefreshConfig from 'src/auth/config/jwt-refresh.config';
import { JwtPayload } from 'src/auth/types/JwtPayload';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtRefreshConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof jwtRefreshConfig>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

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

  async login(user: User) {
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.role,
    );
    const hashedRefreshToken = await hash(refreshToken);
    const refreshTokenModel = await this.refreshTokenService.findByUserId(
      user.id,
    );

    if (!refreshTokenModel) {
      await this.refreshTokenService.create({
        userId: user.id,
        hash: hashedRefreshToken,
      });
    } else {
      await this.refreshTokenService.updateByUserId(user.id, {
        hash: hashedRefreshToken,
      });
    }

    const expiresIn = new Date().setTime(
      new Date().getTime() + +process.env.JWT_ACCESS_EXPIRE_DATE,
    );

    return {
      user: this.userService.normalize(user),
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async generateTokens(userId: string, role: Role) {
    const payload: JwtPayload = { sub: userId, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(user: User) {
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.role,
    );
    const hashedRefreshToken = await hash(refreshToken);
    const { hash: userToken } = await this.refreshTokenService.findByUserId(
      user.id,
    );

    if (!userToken) {
      await this.refreshTokenService.create({
        userId: user.id,
        hash: hashedRefreshToken,
      });
    } else {
      await this.refreshTokenService.updateByUserId(user.id, {
        hash: hashedRefreshToken,
      });
    }

    const expiresIn = new Date().setTime(
      new Date().getTime() + +process.env.JWT_ACCESS_EXPIRE_DATE,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async logout(userId: string) {
    await this.refreshTokenService.updateByUserId(userId, { hash: null });
  }

  async validateJwtUser(userId: string) {
    const userById = await this.userService.findOne(userId);

    if (!userById) {
      throw new UnauthorizedException('User not found');
    }

    return {
      sub: userById.id,
      role: userById.role,
    };
  }
}
