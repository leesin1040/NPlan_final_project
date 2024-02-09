import { Module } from '@nestjs/common';
import { SearchService } from './elasticsearch.service';
import { ElasticsearchController } from './elasticsearch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from 'src/place/entities/place.entity';

@Module({
  imports: [ElasticsearchModule, TypeOrmModule.forFeature([Place])],
  providers: [SearchService],
  controllers: [ElasticsearchController],
})
export class ElasticsearchModule {}
