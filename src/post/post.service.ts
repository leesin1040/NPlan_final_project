import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { postDto } from './dto/post.dto';

@Injectable()
export class postService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPost(userId: number, postDto: postDto) {
    const createdPost = await this.travelRepository.save({
      title: postDto.title,
      creatorId: userId,
    });

    return createdPost;
  }

  async getAllPosts() {
    const posts = await this.travelRepository.find();
    return posts;
  }

  async getPostById(userId: number) {
    const post = await this.travelRepository.findOne(userId);

    if (!post) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }

    return post;
  }

  async getPostsByUser(userId: number) {
    const posts = await this.travelRepository.find({ where: { userId: userId } });
    return posts;
  }

  async updatePost(postId: number, userId: number, postDto: postDto) {
    const post = await this.travelRepository.findOne(userId);

    if (!post) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }

    if (post.userId !== userId) {
      throw new UnauthorizedException('포스트를 업데이트할 권한이 없습니다.');
    }

    const updatedPost = await this.travelRepository.save({
      id: postId,
      title: postDto.title,
    });

    return updatedPost;
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.travelRepository.findOne({
      where: { id: userId },
    });

    if (!post) {
      throw new BadRequestException('게시글 ID가 잘못되었습니다.');
    }
  }
}
