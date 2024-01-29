import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsOptional } from 'class-validator';

export class UpdateScheduleDto extends PartialType(OmitType(CreateScheduleDto, ['dayId'])) {
  @IsOptional()
  transportation: string;

  @IsOptional()
  memo: string;
}
