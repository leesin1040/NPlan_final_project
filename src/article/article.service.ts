import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleDto } from './dto/article.dto';
import { SearchService } from 'src/elasticsearch/elasticsearch.service';
import { User } from 'src/user/entities/user.entity';
import { Article } from './entities/article.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import axios from 'axios';
import FormData from 'form-data';
import cheerio from 'cheerio';
import sharp from 'sharp';

@Injectable()
export class ArticleService {
  constructor(
    private readonly configService: ConfigService,
    private esService: SearchService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  //article에서 이미지와 텍스트 분리
  private extractContent(editorContent: string) {
    const $ = cheerio.load(editorContent);
    const imgUrl = $('img').first().attr('src');
    const textContent = $('body').text() || $('html').text() || $.root().text();
    return { imgUrl, textContent: textContent.trim() };
  }

  // 사용자 ID로 사용자 이름찾기
  private async fetchUserName(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user ? user.name : null;
  }

  // articleId로 코멘트 갯수 찾기
  private async fetchCommentCount(articleId: number) {
    return await this.commentRepository.count({
      where: { articleId: articleId },
    });
  }

  //포스트 만들기
  async createArticle(userId: number, articleDto: ArticleDto) {
    const { articleTitle, editorContent } = articleDto;
    const { textContent } = this.extractContent(editorContent);
    const createdArticle = await this.articleRepository.save({
      articleTitle,
      editorContent,
      userId: userId,
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    await this.esService.indexData('articles', {
      id: createdArticle.id,
      title: createdArticle.articleTitle,
      writer: user.name,
      content: textContent,
    });
    return createdArticle;
  }

  //포스트 전체 조회
  async getAllArticles() {
    // 필요한 컬럼만 선택하여 가져오기
    const articles = await this.articleRepository.find({
      select: ['id', 'articleTitle', 'editorContent', 'userId', 'likesCount'],
    });
    const articleOne = await Promise.all(
      articles.map(async (article) => {
        const { imgUrl, textContent } = this.extractContent(article.editorContent);
        const userName = await this.fetchUserName(article.userId);
        const commentCount = await this.fetchCommentCount(article.id);
        return {
          ...article,
          editorContent: textContent,
          imgUrl,
          userName,
          commentCount,
        };
      }),
    );
    return articleOne;
  }

  // 인기 게시글
  async getByLikeArticles() {
    const articles = await this.articleRepository.find({
      select: ['id', 'articleTitle', 'editorContent', 'userId', 'likesCount'],
    });
    const articleOne = await Promise.all(
      articles.map(async (article) => {
        const { imgUrl, textContent } = this.extractContent(article.editorContent);
        const userName = await this.fetchUserName(article.userId);
        const commentCount = await this.fetchCommentCount(article.id);
        return {
          ...article,
          editorContent: textContent,
          imgUrl,
          userName,
          commentCount,
        };
      }),
    );
    // likeCount를 기준으로 포스트를 정렬하고 상위 4개 선택
    const sortedArticles = articleOne.sort((a, b) => b.likesCount - a.likesCount);
    const topFourArticles = sortedArticles.slice(0, 4);
    return topFourArticles;
  }

  //포스트 상세조회
  async getArticleById(id: number) {
    // 필요한 컬럼만 선택하여 조회
    const article = await this.articleRepository.findOne({
      where: { id },
      select: ['id', 'articleTitle', 'editorContent', 'userId', 'views'],
    });
    if (!article) throw new NotFoundException('포스트를 찾을 수 없습니다.');
    article.views += 1; // 조회수 증가
    await this.articleRepository.save(article);
    const userName = await this.fetchUserName(article.userId); // 작성자 이름 조회
    return {
      ...article,
      writer: userName, // 작성자 이름 추가
    };
  }

  //내 포스트 전체 조회
  async getArticlesByUser(userId: number) {
    const articles = await this.articleRepository.find({
      where: { userId: userId },
      select: ['id', 'articleTitle', 'editorContent', 'userId', 'likesCount'],
    });
    const articleOne = await Promise.all(
      articles.map(async (article) => {
        const { imgUrl, textContent } = this.extractContent(article.editorContent);
        const userName = await this.fetchUserName(article.userId);
        const commentCount = await this.commentRepository.count({
          where: { articleId: article.id },
        });
        return {
          ...article,
          editorContent: textContent,
          imgUrl,
          userName,
          commentCount,
        };
      }),
    );
    return articleOne;
  }

  // 포스트 수정
  async updateArticle(id: number, userId: number, articleDto: ArticleDto) {
    const { articleTitle, editorContent } = articleDto;
    const { textContent } = this.extractContent(editorContent);
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
    await this.esService.updateData('articles', updatedArticle.id.toString(), {
      title: updatedArticle.articleTitle,
      content: textContent,
    });
    return updatedArticle;
  }

  //포스트 삭제
  async deleteArticle(userId: number, articleId: number) {
    const article = await this.articleRepository.findOne({ where: { id: articleId } });

    if (!article) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }
    if (article.userId !== userId) {
      throw new UnauthorizedException('포스트를 삭제할 권한이 없습니다.');
    }
    const deleteArticle = await this.articleRepository.delete(article.id);
    await this.esService.deleteData('articles', article.id.toString());
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
      console.error('이미지 업로드 실패:', response.data); // 에러 로깅 추가
      throw new Error(`이미지 업로드 실패: 상태 코드 ${response.status}`);
    }
  }
}
