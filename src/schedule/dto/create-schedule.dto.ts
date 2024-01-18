import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  day_id: number;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  category_id: number;

  @IsOptional()
  cost: number;

  @IsOptional()
  check_list: JSON;

  @IsOptional()
  transportation: string;

  @IsOptional()
  memo: string;
}
