import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email.service';

@Controller('api/auth')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('email-check')
  async sendAuthCode(@Body('email') email: string, @Res() res: Response): Promise<void> {
    const authNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;

    if (!email) {
      res.status(400).json({
        success: false,
        message: '요청 이메일이 없습니다.',
      });
      return;
    }

    try {
      await this.emailService.sendAuthCode(email, authNumber);

      res.status(200).json({
        success: true,
        message: '이메일 인증 요청에 성공하였습니다.',
        authNumber,
      });
    } catch (err) {
      console.error('emailError', err);
      res.status(500).json({
        success: false,
        message: '이메일 인증 요청에 실패하였습니다.',
      });
    }
  }

  @Post('auth-check')
  async checkAuthCode(
    @Body('email') email: string,
    @Body('authNumber') authNumber: number,
    @Res() res: Response,
  ): Promise<void> {
    if (Number(authNumber) === Number(email)) {
      res.status(200).json({
        success: true,
        message: '이메일 인증 성공',
      });
    } else {
      res.status(200).json({
        success: false,
        message: '이메일 인증 실패',
      });
    }
  }
}
