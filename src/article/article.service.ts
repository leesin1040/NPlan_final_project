import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ArticleDto } from './dto/article.dto';
import { Article } from './entities/article.entity';
import axios from 'axios';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import cheerio from 'cheerio';
import sharp from 'sharp';

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
  async createArticle(userId: number, articleDto: ArticleDto) {
    const { articleTitle, editorContent } = articleDto;
    const createdArticle = await this.articleRepository.save({
      articleTitle,
      editorContent,
      userId: userId,
    });

    return createdArticle;
  }

  //포스트 전체 조회
  async getAllArticles() {
    const articles = await this.articleRepository.find();
    const articleOne = await Promise.all(
      articles.map(async (article) => {
        // Cheerio를 사용하여 editorContent에서 첫 번째 이미지 URL 추출
        const $ = cheerio.load(article.editorContent);
        const imgUrl = $('img').first().attr('src');
        const fullTextContent = $('body').text() || $('html').text() || $.root().text();
        const textContent = fullTextContent.slice(0, 100);
        const user = await this.userRepository.findOne({ where: { id: article.userId } });
        const userName = user ? user.name : null;
        return {
          ...article,
          editorContent: textContent,
          imgUrl,
          userName,
        };
      }),
    );

    return articleOne;
  }

  //포스트 상세조회
  async getArticleById(id: number) {
    const getArticle = await this.articleRepository.findOne({ where: { id } });
    if (!getArticle) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }
    getArticle.views += 1;
    await this.articleRepository.save(getArticle);
    const author = await this.userRepository.findOne({ where: { id: getArticle.userId } });
    const writer = author.name;
    const article = {
      ...getArticle,
      writer,
    };
    return article;
  }

  //내 포스트 전체 조회
  async getArticlesByUser(userId: number) {
    const articles = await this.articleRepository.find({ where: { userId: userId } });
    return articles;
  }

  // 포스트 수정
  async updateArticle(id: number, userId: number, articleDto: ArticleDto) {
    const { articleTitle, editorContent } = articleDto;
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }
    if (article.userId !== userId) {
      throw new UnauthorizedException('포스트를 업데이트할 권한이 없습니다.');
    }
    article.articleTitle = articleTitle;
    article.editorContent = editorContent;
    const updatedArticle = await this.articleRepository.save(article);
    return updatedArticle;
  }

  //포스트 삭제
  async deleteArticle(userId: number, articleId: number) {
    const article = await this.articleRepository.findOne({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    if (article.userId !== userId) {
      throw new UnauthorizedException('게시글을 삭제할 권한이 없습니다.');
    }
    const deleteArticle = await this.articleRepository.remove(article);
    return deleteArticle;
  }

  //이미지 업로드
  async uploadImageToCloudflare(file: Express.Multer.File, maxWidth: number): Promise<string> {
    const url = this.configService.get<string>('CLOUDFLARE_IMG');
    const apiKey = this.configService.get<string>('CLOUDFLARE_API');
    const resizedImageBuffer = await sharp(file.buffer).resize({ width: maxWidth }).toBuffer();
    const formData = new FormData();
    formData.append('file', resizedImageBuffer, file.originalname);

    const response = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
    });
    if (response.status === 200) {
      const imageUrl = response.data.result.variants;
      return imageUrl;
    } else {
      console.error('Error uploading image:', response.data); // 에러 로깅 추가
      throw new Error(`이미지 업로드 실패: 상태 코드 ${response.status}`);
    }
  }
}
