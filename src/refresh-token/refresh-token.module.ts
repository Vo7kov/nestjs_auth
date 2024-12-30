import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  controllers: [RefreshTokenController],
  providers: [PrismaService, RefreshTokenService],
})
export class RefreshTokenModule {}
