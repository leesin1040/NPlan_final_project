import { PickType } from '@nestjs/mapped-types';
import { Schedule } from '../entities/schedule.entity';
import { IsOptional } from 'class-validator';

export class MoveScheduleDto extends PickType(Schedule, ['dayId']) {
  @IsOptional()
  dayId: number;

  index: number;
}
