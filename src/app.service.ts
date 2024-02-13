import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    return `Hello World! Here is ${this.configService.get<number>('SERVER_PORT')}Port!`;
  }

  // 디코에 오류 메시지 보냄
  async sendNotification(message: string) {
    const webhookUrl = `${this.configService.get<string>('DISCORD_WEBHOOK_URL')}`;
    try {
      await axios.post(webhookUrl, { content: message });
    } catch (error) {
      console.error('알림 전송 실패:', error.message);
    }
  }
}
