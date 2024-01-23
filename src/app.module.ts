import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleValidationSchema } from './configs/env-validation.config';
import { typeOrmModuleAsyncOptions } from './configs/database.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TravelModule } from './travel/travel.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { MemberModule } from './member/member.module';
import { ScheduleModule } from './schedule/schedule.module';
import { DayModule } from './day/day.module';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // 'public' 디렉토리 지정
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),
    AuthModule,
    UserModule,
    TravelModule,
    LikeModule,
    CommentModule,
    MemberModule,
    ScheduleModule,
    DayModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: `smtps://${process.env.EMAIL_AUTH_EMAIL}:${process.env.EMAIL_AUTH_PASSWORD}@${process.env.EMAIL_HOST}`,
        defaults: {
          from: `"${process.env.YOUR_EMAIL}" <${process.env.EMAIL_AUTH_EMAIL}>`,
        },
      }),
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // imports: [
  //   MailerModule.forRootAsync({
  //     useFactory: () => ({
  //       transport: `smtps://${process.env.EMAIL_AUTH_EMAIL}:${process.env.EMAIL_AUTH_PASSWORD}@${process.env.EMAIL_HOST}`,
  //       defaults: {
  //         from: `"${process.env.EMAIL_FROM_USER_NAME}" <${process.env.EMAIL_AUTH_EMAIL}>`,
  //       },
  //     }),
  //   }),
  //   EmailModule,
  // ],
})
export class AppModule {}
