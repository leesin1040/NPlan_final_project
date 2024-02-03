import { IsString, IsUrl } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  mapX: number;

  mapY: number;

  @IsString()
  category: string;

  @IsString()
  cat1: string;

  @IsUrl()
  imaUrl?: string;
}
