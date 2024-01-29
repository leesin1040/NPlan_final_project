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

  @Cron(CronExpression.EVERY_5_SECONDS)
  async updatePlacesJob() {
    try {
      const place = await this.placeRepository.findOne({ where: { id: 2 } });
      const updatePlace = await this.updatePlaceRepository.findOne({ where: { id: 3 } });
      console.log(place.name);
      console.log(updatePlace.name);
    } catch (error) {
      this.logger.error(`에러: ${error.message}`);
    }
  }
}
