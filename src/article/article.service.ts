import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ArticleDto } from './dto/article.dto';
import { Article } from './entities/article.entity';
import axios from 'axios';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticleService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  //포스트 만들기
  async createArticle(userId: number, articleDto: ArticleDto, imageUrl: string) {
    const { articleTitle, articleContent } = articleDto;
    const createdArticle = await this.articleRepository.save({
      articleTitle,
      articleContent,
      userId: userId,
      imageUrl,
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

  //이미지 업로드
  async uploadImageToCloudflare(file: Express.Multer.File): Promise<string> {
    const url = this.configService.get<string>('CLOUDFLARE_IMG');
    const apiKey = this.configService.get<string>('CLOUDFLARE_API');
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
    });
    if (response.status === 200) {
      return response.data.result.variants;
    } else {
      console.error('Error uploading image:', response.data); // 에러 로깅 추가
      throw new Error(`이미지 업로드 실패: 상태 코드 ${response.status}`);
    }
  }
}
