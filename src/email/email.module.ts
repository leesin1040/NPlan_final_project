import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule을 import
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>('YOUR_EMAIL'),
            pass: configService.get<string>('YOUR_APP_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService], // ConfigService를 inject
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
