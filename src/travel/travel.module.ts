import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Travel } from './entities/travel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, User])],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}
