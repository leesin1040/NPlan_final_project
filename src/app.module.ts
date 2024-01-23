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
import { PlaceModule } from './place/place.module';

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
    PlaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
