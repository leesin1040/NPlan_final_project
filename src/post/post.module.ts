import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { postController } from './post.controller';
import { postService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([post, User, Travel])],
  controllers: [postController],
  providers: [postService],
  exports: [postService],
})
export class postModule {}
