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

  async likePost(userId: number, travelId: number) {
    const existingLike = await this.likeRepository.findOne({
      where: { userId, travelId },
    });

    if (existingLike) {
      throw new NotFoundException('이미 좋아요를 누른 게시글 입니다.');
    }

    const newLike = this.likeRepository.create({ userId, travelId });
    await this.likeRepository.save(newLike);

    await this.updateArticleLikesCount(travelId);

    return newLike;
  }

  private async updateArticleLikesCount(travelId: number) {
    const post = await this.articleRepository.findOne({
      where: { id: travelId },
    });
    if (!post) {
      throw new NotFoundException('게시글을 찾을수 없습니다.');
    }

    const likesCount = await this.likeRepository.count({ where: { travelId } });
    post.likesCount = likesCount;
    await this.articleRepository.save(post);
  }
}
