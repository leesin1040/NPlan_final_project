import { PickType } from '@nestjs/swagger';
import { Travel } from '../entities/travel.entity';

export class CreateTravelDto extends PickType(Travel, [
  'title',
  'color',
  'region',
  'theme',
  'start_date',
  'end_date',
]) {}
