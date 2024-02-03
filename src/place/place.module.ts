import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  providers: [PlaceService],
  controllers: [PlaceController],
  exports: [PlaceService],
})
export class PlaceModule {}
