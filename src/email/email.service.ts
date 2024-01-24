import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  private logger = new Logger();
  sendAuthCode(email: string): void {
    console.log(email);

    this.mailerService
      .sendMail({
        to: email,
        subject: '인증 이메일 입니다.',
        text: '안녕하세요!',
        html: '<b>WELCOME</b>',
      })
      .then(() => {
        console.log('성공!');
      })
      .catch((error) => {
        this.logger.error(error);
        console.log(error);
      });
  }
}
