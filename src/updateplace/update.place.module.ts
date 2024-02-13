import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Place } from 'src/place/entities/place.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdatePlace } from './entitiy/update.place.entity';
import { UpdatePlaceService } from './update.place.service';
import { UpdatePlaceController } from './update.place.controller';
import { TourApiPlace } from './entitiy/tourapi.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([UpdatePlace, TourApiPlace], 'travelPlace'),
    TypeOrmModule.forFeature([Place]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  providers: [UpdatePlaceService],
  controllers: [UpdatePlaceController],
  exports: [UpdatePlaceService],
})
export class UpdatePlaceModule {}
