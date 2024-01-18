import { OmitType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto extends PartialType(OmitType(CreateScheduleDto, ['day_id'])) {}
