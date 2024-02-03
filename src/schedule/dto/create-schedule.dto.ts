import { IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  dayId: number;

  @IsNotEmpty()
  placeId: number;
}
