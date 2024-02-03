import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  //포스트만들기
  @UseGuards(AuthGuard('jwt'))
  @Post('/article')
  async createPost(@Body() articleDto: ArticleDto, @Req() req) {
    const userId = req.user.id;
    const data = this.articleService.createArticle(userId, articleDto);
    return { statusCode: HttpStatus.CREATED, message: '게시글 생성에 성공했습니다.', data };
  }

  //포스트 상세조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/article/:id')
  getArticleById(@Param('id') id: number) {
    const data = this.articleService.getArticleById(id);
    return { statusCode: HttpStatus.FOUND, message: '게시글 상세조회에 성공했습니다.', data };
  }

  //내 포스트 전체 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/article')
  getArticlesByUser(@Req() req) {
    const userId = req.user.id;
    const data = this.articleService.getArticlesByUser(userId);
    return { statusCode: HttpStatus.FOUND, message: '게시글 조회에 성공했습니다.', data };
  }

  //포스트 전체 조회
  @Get('/article')
  getAllArticles() {
    const data = this.articleService.getAllArticles();
    return { statusCode: HttpStatus.FOUND, message: '게시글 전체조회에 성공했습니다.', data };
  }

  //포스트 수정
  @UseGuards(AuthGuard('jwt'))
  @Put('/article/:id')
  updateArticle(@Param('id') id: number, @Req() req, @Body() articleDto: ArticleDto) {
    const userId = req.user.id;
    const data = this.articleService.updateArticle(id, userId, articleDto);
    return { statusCode: HttpStatus.OK, message: '게시글 수정에 성공했습니다.', data };
  }

  //포스트 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('/article/:id')
  async deleteArticle(@Param('id') postId: number, @Req() req) {
    const userId = req.user.id;
    const data = this.articleService.deleteArticle(userId, postId);
    return { statusCode: HttpStatus.OK, message: '게시글 삭제에 성공했습니다.', data };
  }
}
