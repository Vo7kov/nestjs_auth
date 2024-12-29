import { Module } from '@nestjs/common';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService, LocalStrategy],
})
export class AuthModule {}
