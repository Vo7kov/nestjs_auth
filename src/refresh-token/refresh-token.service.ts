import { Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRefreshTokenDto: CreateRefreshTokenDto) {
    return this.prisma.refreshToken.create({ data: createRefreshTokenDto });
  }

  async findByUserId(userId: string) {
    return await this.prisma.refreshToken.findUnique({
      where: { userId },
    });
  }

  updateByUserId(userId: string, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    return this.prisma.refreshToken.update({
      where: { userId },
      data: updateRefreshTokenDto,
    });
  }

  deleteByUserId(userId: string) {
    return this.prisma.refreshToken.delete({ where: { userId } });
  }

  async validate(userId: string, refreshToken: string) {
    const refreshTokenModel = await this.findByUserId(userId);

    if (!refreshTokenModel.hash) {
      throw new UnauthorizedException('Refresh token not found for the user');
    }

    const refreshTokenMatch = await verify(
      refreshTokenModel.hash,
      refreshToken,
    );

    if (!refreshTokenMatch) {
      throw new UnauthorizedException(
        'Refresh token does not match the stored token',
      );
    }

    return { id: userId };
  }
}
