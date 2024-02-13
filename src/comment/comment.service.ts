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

  async getAllComment(articleId: number) {
    const comments = await this.commentRepository.find({
      where: { articleId: articleId },
      relations: ['user'],
    });

    // 댓글의 작성자 이름 추가
    const commentsWithUsernames = await Promise.all(
      comments.map(async (comment) => {
        const user = await comment.user;
        const userName = user ? user.name : null;
        return {
          ...comment,
          userName,
        };
      }),
    );

    return { comments: commentsWithUsernames };
  }

  async update(userId: number, commentId: number, comment: string) {
    const getComment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!getComment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (getComment.userId !== userId) {
      throw new UnauthorizedException('댓글을 수정할 권한이 없습니다.');
    }

    const updatedComment = await this.commentRepository.update(commentId, { comment });
    return { updatedComment };
  }

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
