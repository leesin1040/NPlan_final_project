import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like } from './entities/like.entity';
import { Article } from 'src/article/entities/article.entity';
import {SearchModule} from "../elasticsearch/elasticsearch.module";
import {LikeEsRepository} from "./likeEs.repository";

@Module({
  imports: [
      TypeOrmModule.forFeature([Article, User, Like]),
      SearchModule,
  ],
  controllers: [LikeController],
  providers: [LikeService, LikeEsRepository],
  exports: [LikeService],
})
export class LikeModule {}
