import { CreatePlaceDto } from './dto/create-place.dto';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { DataSource, In, IsNull, Like, Repository } from 'typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private dataSource: DataSource,
  ) {}

  // place 지역별 ex)대표지역 전체(인기순)
  async getMainRegion(region: string) {
    const getMainRegion = await this.placeRepository.find({
      where: {
        areaCode: region,
      },
      order: { rank: 'DESC' },
      take: 30,
    });
    return getMainRegion;
  }

  // 대표지역 + 관광/숙박/음식/쇼핑
  async getContent(region: string, content: number) {
    const getContent = await this.placeRepository.find({
      where: {
        areaCode: region,
        contentTypeId: content,
      },
      order: { rank: 'DESC' },
      take: 30,
    });

    return getContent;
  }

  // 이전등록한 place 주변 좌표들

  async getAroundRegions(placeId: number, contentTypeId: number) {
    try {
      const beforePlacePoint = await this.placeRepository.findOne({ where: { id: placeId } });

      const aroundSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.contentTypeId = :contentTypeId', { contentTypeId: contentTypeId })
        .andWhere('ST_Distance_Sphere(place.placePoint, ST_GeomFromText(:beforePoint))<= :radius', {
          beforePoint: beforePlacePoint.placePoint,
          radius: 5000,
        })
        .limit(60)
        .getMany();

      return aroundSpots;
    } catch (error) {
      console.error('Error in getAroundRegions:', error);
      throw error;
    }
  }
}
