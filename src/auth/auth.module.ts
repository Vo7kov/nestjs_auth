import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import jwtRefreshConfig from 'src/auth/config/jwt-refresh.config';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/auth/strategies/refresh.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(jwtRefreshConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    RefreshTokenService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
