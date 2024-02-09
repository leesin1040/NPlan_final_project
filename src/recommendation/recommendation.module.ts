import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Place } from 'src/place/entities/place.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { Travel } from 'src/travel/entities/travel.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Day } from 'src/day/entities/day.entity';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { Like } from 'src/like/entities/like.entity';
import { LikeModule } from 'src/like/like.module';
import { PlaceModule } from 'src/place/place.module';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Place, Travel, Schedule, Day, Like])],
  providers: [RecommendationService],
  controllers: [RecommendationController],
  exports: [RecommendationService],
})
export class RecommendateionModule {}
