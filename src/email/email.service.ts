import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  sendAuthCode(email: string, authNumber: number): Promise<void> {
    console.log(email);
    return this.mailerService.sendMail({
      to: email,
      subject: '[NPlan] 이메일 확인 인증번호 안내',
      text: `아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n인증번호 4자리 👉 ${authNumber}`,
    });
  }
}
