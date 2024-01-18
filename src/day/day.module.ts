import { Module } from '@nestjs/common';
import { DayService } from './day.service';
import { DayController } from './day.controller';
import { Day } from './entities/day.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Day])],
  providers: [DayService],
  controllers: [DayController],
  exports: [DayService],
})
export class DayModule {}
