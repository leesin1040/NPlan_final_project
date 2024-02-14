import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { Article } from './entities/article.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { SearchModule } from 'src/elasticsearch/elasticsearch.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Travel, Comment]), SearchModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
