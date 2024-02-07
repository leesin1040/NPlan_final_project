import { Injectable, NotFoundException } from '@nestjs/common';
import { Like } from './entities/like.entity';
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

  async updateArticleLikesCount(articleId: number): Promise<void> {
    const article = await this.articleRepository.findOne({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 게시글에 대한 좋아요 수를 직접 계산합니다.
    const likesCount = await this.likeRepository.count({ where: { articleId } });

    // 계산된 좋아요 수를 게시글 엔티티에 저장합니다.
    article.likesCount = likesCount;
    await this.articleRepository.save(article);
  }
}
