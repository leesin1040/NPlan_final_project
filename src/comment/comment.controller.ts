import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/:articleId')
  async createComment(
    @Req() req,
    @Param('articleId') articleId: number,
    @Body('comment') comment: string,
  ) {
    const userId = req.user.id;
    const data = this.commentService.createComment(userId, articleId, comment);

    return {
      statusCode: HttpStatus.CREATED,
      message: '댓글 등록에 성공하였습니다!',
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:commentId')
  async update(
    @Param('commentId') commentId: number,
    @Req() req,
    @Body('comment') comment: string,
  ) {
    const userId = req.user.id;
    const data = await this.commentService.update(userId, commentId, comment);
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 수정에 성공했습니다.',
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: number, @Req() req) {
    const userId = req.user.id;
    const data = await this.commentService.deleteComment(userId, commentId);
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 삭제에 성공하였습니다!',
      data,
    };
  }
}
