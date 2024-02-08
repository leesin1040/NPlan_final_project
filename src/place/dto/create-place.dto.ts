import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber() // Assuming mapX and mapY are numbers
  mapX: number;

  @IsNumber()
  mapY: number;

  @IsString()
  cat1: string;
}
