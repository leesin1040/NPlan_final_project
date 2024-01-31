import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { Article } from './entities/article.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User, Travel])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
