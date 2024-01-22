import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  dayId: number;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  contentId: number;

  @IsOptional()
  transportation: string;

  @IsOptional()
  memo: string;
}
