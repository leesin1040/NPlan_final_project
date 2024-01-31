import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ArticleDto } from './dto/article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  //포스트 만들기
  async createArticle(userId: number, articleDto: ArticleDto) {
    const { articleTitle, articleContent } = articleDto;
    const createdArticle = await this.articleRepository.save({
      articleTitle,
      articleContent,
      userId: userId,
    });

    return createdArticle;
  }

  //포스트 전체 조회
  async getAllArticles() {
    const articles = await this.articleRepository.find();
    return articles;
  }

  //포스트 상세조회
  async getArticleById(id: number) {
    const article = await this.articleRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }

    return article;
  }

  //내 포스트 전체 조회
  async getArticlesByUser(userId: number) {
    const articles = await this.articleRepository.find({ where: { userId: userId } });
    return articles;
  }

  //포스트 수정
  async updateArticle(id: number, userId: number, articleDto: ArticleDto) {
    const { articleTitle, articleContent } = articleDto;
    const article = await this.articleRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }

    if (article.userId !== userId) {
      throw new UnauthorizedException('포스트를 업데이트할 권한이 없습니다.');
    }

    const updatedarticle = await this.articleRepository.save({
      articleTitle,
      articleContent,
    });

    return updatedarticle;
  }

  //포스트 삭제
  async deleteArticle(userId: number, id: number) {
    const article = await this.articleRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (article.userId !== userId) {
      throw new UnauthorizedException('게시글을 삭제할 권한이 없습니다.');
    }
    const deleteArticle = await this.articleRepository.delete({ id });

    return deleteArticle;
  }
}
