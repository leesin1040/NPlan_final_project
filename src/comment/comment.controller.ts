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
  @Post(':commentId')
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
  @Patch(':commentId')
  update(@Param('userId') userId: number, @Param('commentId') commentId: number, @Req() req) {
    const authenticatedUserId = req.user.id;
    if (userId !== authenticatedUserId) {
      throw new UnauthorizedException('댓글을 수정할 권한이 없습니다.');
    }

    const data = this.commentService.update(userId, commentId);
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 수정에 성공했습니다.',
      data,
    };
  }

  @Delete(':commentId')
  async deleteComment(@Param('commentId') userid: number, commentId: number) {
    const data = await this.commentService.deleteComment(userid, commentId);
    return {
      statusCode: HttpStatus.OK,
      message: '댓글 삭제에 성공하였습니다!',
      data,
    };
  }
}
