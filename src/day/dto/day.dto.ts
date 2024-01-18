import { IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { Day } from '../entities/day.entity';

export class DayDto extends PickType(Day, ['day']) {
  @IsNotEmpty({})
  day: number;
}
