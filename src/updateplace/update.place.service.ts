import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Place } from 'src/place/entities/place.entity';
import { UpdatePlace } from './entitiy/update.place.entity';

@Injectable()
export class UpdatePlaceService {
  private readonly logger = new Logger(UpdatePlaceService.name);

  constructor(
    @InjectRepository(UpdatePlace, 'travelPlace')
    private readonly updatePlaceRepository: Repository<UpdatePlace>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private dataSource: DataSource,
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // async updatePlacesJob() {
  //   try {
  //     const queryRunner = this.dataSource.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     // MySQL에서 외래 키 제약 무시하고 모든 데이터 삭제
  //     await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
  //     await queryRunner.query('TRUNCATE TABLE place');
  //     await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
  //     const getplace = await this.updatePlaceRepository.find({ order: { id: 'ASC' }, take: 10 });
  //     await this.placeRepository.save(getplace);
  //     console.log('성공');
  //   } catch (error) {
  //     this.logger.error(`에러: ${error.message}`);
  //   }
  // }
}
