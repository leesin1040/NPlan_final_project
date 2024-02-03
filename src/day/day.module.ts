import { Module } from '@nestjs/common';
import { DayService } from './day.service';
import { DayController } from './day.controller';
import { Day } from './entities/day.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Travel } from 'src/travel/entities/travel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Day, Travel])],
  providers: [DayService],
  controllers: [DayController],
  exports: [DayService],
})
export class DayModule {}
