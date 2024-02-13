import { Controller, Delete, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './articlelike.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/:articleId')
  async likePost(@Req() req, @Param('articleId') articleId: number) {
    const userId = req.user.id;
    console.log(userId);
    const { likesCount } = await this.likeService.likePost(userId, articleId);
    return {
      statusCode: HttpStatus.CREATED,
      message: '좋아요!',
      likesCount,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':articleId')
  async unlikePost(@Req() req, @Param('articleId') articleId: number) {
    const userId = req.user.id;
    const { likesCount } = await this.likeService.unlikePost(userId, articleId);
    return {
      statusCode: HttpStatus.OK,
      message: '좋아요 취소!',
      likesCount,
    };
  }
}
