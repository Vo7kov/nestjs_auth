import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.getProfile(id);
  }
}
