import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  dayId: number;

  @IsNotEmpty()
  placeId: number;

  @IsOptional()
  transportation: string;

  @IsOptional()
  memo: string;
}
