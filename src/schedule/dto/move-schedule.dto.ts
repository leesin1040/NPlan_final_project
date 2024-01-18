import { PickType } from '@nestjs/mapped-types';
import { Schedule } from '../entities/schedule.entity';
import { IsOptional } from 'class-validator';

export class MoveScheduleDto extends PickType(Schedule, ['day_id']) {
  @IsOptional()
  day_id: number;

  index: number;
}
