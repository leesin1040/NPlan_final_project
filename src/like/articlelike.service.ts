import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  // 아티클별 나의 좋아요 여부 확인
  async likeByArticle(userId: number, articleId: number) {
    // 유저 아이디별로 아티클에 좋아요 여부 확인
    const likedArticle = await this.likeRepository.findOne({
      where: { userId, articleId },
    });
    return !!likedArticle; // 좋아요 여부를 boolean 값으로 반환
  }

  async likePost(userId: number, articleId: number) {
    const existingLike = await this.likeRepository.findOne({
      where: { userId, articleId },
    });
    if (existingLike) {
      throw new BadRequestException('이미 좋아요를 누른 게시글 입니다.');
    }
    const newLike = this.likeRepository.create({ userId, articleId });
    await this.likeRepository.save(newLike);
    await this.updateArticleLikesCount(articleId);
    const updatedLikesCount = await this.likeRepository.count({ where: { articleId } });
    return { likesCount: updatedLikesCount };
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
    const updatedLikesCount = await this.likeRepository.count({ where: { articleId } });
    return { likesCount: updatedLikesCount };
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
      if (likesCount < 0) {
        likesCount = 0; // 좋아요 수가 0보다 작으면 0으로 유지
      }
    }

    post.likesCount = likesCount;
    await this.articleRepository.save(post);
  }
}
