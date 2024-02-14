import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private configService: ConfigService) {}

  // connect redis
  // OnModuleInit : 모듈 초기화 시 Redis DB와 연결
  async onModuleInit() {
    this.client = createClient({
      // redis URL
      url: `redis://${this.configService.get('REDIS_USERNAME')}:${this.configService.get(
        'REDIS_PASSWORD',
      )}@${this.configService.get('REDIS_HOST')}:${this.configService.get('REDIS_PORT')}/0`,
    });
    this.client.on('error', (error) => console.error(`Redis Error: ${error}`));

    await this.client.connect();
    console.log('Connected to Redis');
  }

  // disconnect redis
  // OnModuleDestroy : 모듈 파괴 시 연결 종료
  async onModuleDestroy() {
    await this.client.quit();
  }

  // set refresh token
  async setRefreshToken(userId: number, token: string): Promise<void> {
    await this.client.set(`refresh_token:${userId}`, token, {
      EX: 60 * 60 * 24 * 7, // 7일 유효기간
    });
  }

  // get refresh token
  async getRefreshToken(userId: number): Promise<string | null> {
    return await this.client.get(`refresh_token:${userId}`);
  }

  // remove refresh token
  async removeRefreshToken(userId: number): Promise<void> {
    await this.client.del(`refresh_token:${userId}`);
  }
}
