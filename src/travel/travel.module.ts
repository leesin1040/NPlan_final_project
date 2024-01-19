import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Travel } from './entities/travel.entity';
import { Like } from 'src/like/entities/like.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Member } from 'src/member/entities/member.entity';
import { Day } from 'src/day/entities/day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Travel, Day, User, Like, Comment, Member])],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}
