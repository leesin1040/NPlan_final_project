import { Module } from '@nestjs/common';
import { LikeController } from './articlelike.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like } from './entities/articlelike.entity';
import { Article } from 'src/article/entities/article.entity';
import { LikeService } from './articlelike.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Like])],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
