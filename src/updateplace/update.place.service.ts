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
    try {
      // const getPlaces = await this.updatePlaceRepository.find({});

      // getPlaces.forEach((getPlace) => {
      //   if (getPlace.address.substring(0, 2) === '서울') {
      //     getPlace.areaCode = '1';
      //   } else if (getPlace.address.substring(0, 2) === '인천') {
      //     getPlace.areaCode = '2';
      //   } else if (getPlace.address.substring(0, 2) === '대전') {
      //     getPlace.areaCode = '3';
      //   } else if (getPlace.address.substring(0, 2) === '대구') {
      //     getPlace.areaCode = '4';
      //   } else if (getPlace.address.substring(0, 2) === '광주') {
      //     getPlace.areaCode = '5';
      //   } else if (getPlace.address.substring(0, 2) === '부산') {
      //     getPlace.areaCode = '6';
      //   } else if (getPlace.address.substring(0, 2) === '울산') {
      //     getPlace.areaCode = '7';
      //   } else if (getPlace.address.substring(0, 2) === '세종') {
      //     getPlace.areaCode = '8';
      //   } else if (getPlace.address.substring(0, 2) === '경기') {
      //     getPlace.areaCode = '31';
      //   } else if (getPlace.address.substring(0, 2) === '강원') {
      //     getPlace.areaCode = '32';
      //   } else if (getPlace.address.substring(0, 2) === '충북') {
      //     getPlace.areaCode = '33';
      //   } else if (getPlace.address.substring(0, 2) === '충남') {
      //     getPlace.areaCode = '34';
      //   } else if (getPlace.address.substring(0, 2) === '경북') {
      //     getPlace.areaCode = '35';
      //   } else if (getPlace.address.substring(0, 2) === '경남') {
      //     getPlace.areaCode = '36';
      //   } else if (getPlace.address.substring(0, 2) === '전북') {
      //     getPlace.areaCode = '37';
      //   } else if (getPlace.address.substring(0, 2) === '전남') {
      //     getPlace.areaCode = '38';
      //   } else if (getPlace.address.substring(0, 2) === '제주') {
      //     getPlace.areaCode = '39';
      //   }
      // });
      // await this.updatePlaceRepository.save(getPlaces);

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // MySQL에서 외래 키 제약 무시하고 모든 데이터 삭제
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
      await queryRunner.query('TRUNCATE TABLE place');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
      const getplace = await this.updatePlaceRepository.find({ order: { id: 'ASC' } });
      await this.placeRepository.save(getplace);
      console.log('성공');
    } catch (error) {
      this.logger.error(`에러: ${error.message}`);
    }
  }
}
