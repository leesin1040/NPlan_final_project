import { Controller, Post, Body, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { EmailService } from './email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('api/auth')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 입력받은 이메일로 인증번호 전송
  @Post('email-check')
  async sendAuthCode(@Body('email') email: string, @Res() res: Response): Promise<void> {
    const authNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;

    if (!email) throw new BadRequestException('요청된 이메일이 없습니다.');

    const user = await this.userRepository.find({ where: { email } });

    if (user.length) throw new BadRequestException('이미 가입된 이메일입니다.');

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

  // 이메일로 전송한 인증번호와 사용자가 입력한 인증번호가 일치하는지 확인
  @Post('auth-check')
  async checkAuthCode(
    @Body('enteredNumber') enteredNumber: number,
    @Body('authNumber') authNumber: number,
    @Res() res: Response,
  ): Promise<void> {
    console.log(authNumber, enteredNumber);
    if (!authNumber || !enteredNumber)
      throw new BadRequestException('인증번호가 발송되지 않았거나, 입력되지 않았습니다.');
    if (+authNumber === +enteredNumber) {
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
