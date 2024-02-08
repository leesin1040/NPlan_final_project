import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule, TypeOrmModule.forFeature([User])], // ConfigModule을 import
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
    UserModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
