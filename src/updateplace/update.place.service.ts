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
  async updatePlaces() {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.query('use `travel-planner`');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
      await queryRunner.query('TRUNCATE TABLE place');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
      const getPlace = await this.updatePlaceRepository.find({});
      await this.placeRepository.insert(getPlace);
      await queryRunner.commitTransaction();
      console.log('끝');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`에러: ${error.message}`);
    }
  }
}
