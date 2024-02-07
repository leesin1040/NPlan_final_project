import { Injectable, NotFoundException } from '@nestjs/common';
import { Like } from './entities/articlelike.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async likePost(userId: number, articleId: number) {
    const existingLike = await this.likeRepository.findOne({
      where: { userId, articleId },
    });

    if (existingLike) {
      throw new NotFoundException('이미 좋아요를 누른 게시글 입니다.');
    }

    const newLike = this.likeRepository.create({ userId, articleId });
    await this.likeRepository.save(newLike);

    await this.updateArticleLikesCount(articleId);

    return newLike;
  }

  async unlikePost(userId: number, articleId: number) {
    const existingLike = await this.likeRepository.findOne({
      where: { userId, articleId },
    });

    if (!existingLike) {
      throw new NotFoundException('이미 좋아요를 취소한 게시글 입니다.');
    }

    await this.likeRepository.remove(existingLike);

    await this.updateArticleLikesCount(articleId, true);

    return existingLike;
  }

  private async updateArticleLikesCount(articleId: number, decrease: boolean = false) {
    const post = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    let likesCount = await this.likeRepository.count({ where: { articleId } });

    if (decrease) {
      likesCount--; // 좋아요를 취소했으므로 좋아요 수 감소
    }

    post.likesCount = likesCount;
    await this.articleRepository.save(post);
  }
}
