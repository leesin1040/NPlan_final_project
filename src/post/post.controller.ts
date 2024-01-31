import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { postDto } from './dto/post.dto';
import { post } from './entities/post.entity';

@Controller('post')
export class postController {
  constructor(private readonly postService: postDto) {}

  @Post('/post')
  async createPost(@Body() postDto: postDto, @Req() req) {
    const ownerId = req.user.id;
    return this.postService.createPost(ownerId, postDto);
  }

  @Get('/posts/:id')
  fetchPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Get('/posts')
  fetchPosts(): post[] {
    return this.postService.findAll();
  }

  @Delete('/posts/:id')
  deletePost(@Param('id') postId: number, @Req() req) {
    const ownerId = req.user.id;
    return this.postService.deletePost(ownerId, postId);
  }
}
