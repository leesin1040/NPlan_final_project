import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(userId: number, articleId: number, comment: string) {
    const newComment = await this.commentRepository.save({
      userId,
      articleId,
      comment,
    });
    return { newComment };
  }

  //   async update()

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new UnauthorizedException('댓글을 삭제할 권한이 없습니다.');
    }
    const deleteComment = await this.commentRepository.delete(comment.id);
    return deleteComment;
  }
}
