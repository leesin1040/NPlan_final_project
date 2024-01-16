import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    return `Hello World! Here is ${this.configService.get<number>(
      'SERVER_PORT',
    )}Port!`;
  }
}
