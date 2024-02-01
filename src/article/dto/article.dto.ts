import { PickType } from '@nestjs/swagger';
import { Article } from '../entities/article.entity';

export class ArticleDto extends PickType(Article, ['articleTitle', 'articleContent']) {}
