/* eslint-disable indent */
import { IsString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsString()
  hash: string;

  @IsString()
  userId: string;
}
