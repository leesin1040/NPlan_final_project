import { Controller, Delete, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { LikeService } from './articlelike.service';

@Controller('api/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':articleId')
  likePost(@Req() req, @Param('articleId') articleId: number) {
    const userId = req.user.id;
    const data = this.likeService.likePost(userId, articleId);
    return {
      statusCode: HttpStatus.CREATED,
      message: '좋아요!',
      data,
    };
  }

  @Delete(':articleId')
  unlikePost(@Req() req, @Param('articleId') articleId: number) {
    const userId = req.user.id;
    const deletedData = this.likeService.unlikePost(userId, articleId);
    return {
      statusCode: HttpStatus.OK,
      message: '좋아요 취소!',
      deletedData,
    };
  }
}
