import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { type Request as Req } from 'express';

import { Public } from 'src/auth/decorators/public.decorator';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() req: Req) {
    return this.authService.login(req.user);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refreshToken(@Request() req: Req) {
    return this.authService.refreshToken(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Request() req: Req) {
    this.authService.logout(req.user.sub);
  }
}
