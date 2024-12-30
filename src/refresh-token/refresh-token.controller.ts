import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { RefreshTokenService } from './refresh-token.service';

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Post()
  create(@Body() createRefreshTokenDto: CreateRefreshTokenDto) {
    return this.refreshTokenService.create(createRefreshTokenDto);
  }

  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    return this.refreshTokenService.findByUserId(userId);
  }

  @Patch(':userId')
  updateByUserId(
    @Param('userId') userId: string,
    @Body() updateRefreshTokenDto: UpdateRefreshTokenDto,
  ) {
    return this.refreshTokenService.updateByUserId(
      userId,
      updateRefreshTokenDto,
    );
  }
}
