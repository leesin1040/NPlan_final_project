import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: configService.get<boolean>('DB_SYNC'),
    autoLoadEntities: true,
    logging: true,
  }),
};
export const typeOrmModuleAsyncOptionsUpdatePlace: TypeOrmModuleAsyncOptions = {
  name: 'travelPlace',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: configService.get<string>('DB_PLACE_HOST'),
    port: configService.get<number>('DB_PLACE_PORT'),
    username: configService.get<string>('DB_PLACE_USERNAME'),
    password: configService.get<string>('DB_PLACE_PASSWORD'),
    database: configService.get<string>('DB_PLACE_NAME'),
    synchronize: configService.get<boolean>('DB_PLACE_SYNC'),
    autoLoadEntities: true,
    logging: true,
  }),
};
