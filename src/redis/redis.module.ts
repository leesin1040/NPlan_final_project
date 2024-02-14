import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  // imports: service에 있는 redis DB연결을 이쪽으로 빼와도 됨(better)
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
