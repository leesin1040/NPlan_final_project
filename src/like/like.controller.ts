import { Controller, Param, Post, Req } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('api/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  likePost(@Req() req, @Param('postId') postId: number) {
    const userId = req.user.id;
    return this.likeService.likePost(userId, postId);
  }
}
