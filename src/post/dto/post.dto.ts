import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { post } from '../entities/post.entity';

export class postDto extends PickType(post, ['title']) {
  @IsNotEmpty({ message: '게시물 이름을 입력해주세요.' })
  title: string;

  // @IsNotEmpty({ message: '게시글 소개글을 입력해주세요'})
}
