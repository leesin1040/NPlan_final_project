import { Controller, Param, Post, Req } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('api/like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':articleId')
  likePost(@Req() req, @Param('articleId') articleId: number) {
    const userId = req.user.id;
    return;
  }
}
