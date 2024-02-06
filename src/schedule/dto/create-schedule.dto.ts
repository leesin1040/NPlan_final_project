import { IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty({ message: '스케줄을 저장할 일차에 대한 정보가 없습니다.' })
  dayId: number;

  @IsNotEmpty({ message: '스케줄을 저장할 장소에 대한 정보가 없습니다.' })
  placeId: number;
}
