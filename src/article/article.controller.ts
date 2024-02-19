import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  //포스트만들기
  @UseGuards(AuthGuard('jwt'))
  @Post('/posting')
  async createPost(
    @Body() articleDto: ArticleDto,
    // @Body('travelId', ParseIntPipe) travelId: number,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      const data = await this.articleService.createArticle(userId, articleDto);
      return { statusCode: HttpStatus.CREATED, message: '게시글 생성에 성공했습니다.', data };
    } catch (error) {
      console.log(error);
    }
  }

  //포스트 상세조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/:articleId')
  getArticleById(@Param('id') articleId: number) {
    const data = this.articleService.getArticleById(articleId);
    return { statusCode: HttpStatus.FOUND, message: '게시글 상세조회에 성공했습니다.', data };
  }

  //내 포스트 전체 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/my-articles')
  getArticlesByUser(@Req() req) {
    const userId = req.user.id;
    const data = this.articleService.getArticlesByUser(userId);
    return { statusCode: HttpStatus.FOUND, message: '게시글 조회에 성공했습니다.', data };
  }

  //포스트 전체 조회
  @Get()
  getAllArticles() {
    const data = this.articleService.getAllArticles();
    return { statusCode: HttpStatus.FOUND, message: '게시글 전체조회에 성공했습니다.', data };
  }

  //포스트 수정
  @UseGuards(AuthGuard('jwt'))
  @Put('/:articleId')
  async updateArticle(
    @Param('articleId') articleId: number,
    @Req() req,
    @Body() articleDto: ArticleDto,
  ) {
    const userId = req.user.id;
    const data = await this.articleService.updateArticle(articleId, userId, articleDto);
    return { statusCode: HttpStatus.OK, message: '게시글 수정에 성공했습니다.', data };
  }

  //포스트 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:articleId')
  async deleteArticle(@Param('articleId') articleId: number, @Req() req) {
    const userId = req.user.id;
    const data = this.articleService.deleteArticle(userId, articleId);
    return { statusCode: HttpStatus.OK, message: '게시글 삭제에 성공했습니다.', data };
  }

  //이미지 업로드
  @UseGuards(AuthGuard('jwt'))
  @Post('/img')
  @UseInterceptors(FileInterceptor('file'))
  async imgUpload(@UploadedFile() file: Express.Multer.File) {
    const maxWidth = 500;
    const imageUrl = await this.articleService.uploadImageToCloudflare(file, maxWidth);
    return { imageUrl };
  }
}
