import { CreatePlaceDto } from './dto/create-place.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { DataSource, In, Like, Repository } from 'typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  // tour api에서 받아온 place 정보 저장
  async createPlace(createPlaceDto: CreatePlaceDto) {
    return await this.placeRepository.save({
      name: createPlaceDto.name,
      address: createPlaceDto.address,
      mapX: createPlaceDto.mapX,
      mapY: createPlaceDto.mapY,
      category: createPlaceDto.category,
      cat1: createPlaceDto.cat1,
      imaUrl: createPlaceDto.imaUrl,
    });
  }

  async getAddress() {
    const getAddress = await this.placeRepository.find({
      order: { id: 'ASC' },
    });
    return getAddress;
  }
  async getMainRegion(region: string) {
    const getMainRegion = await this.placeRepository.find({
      where: {
        address: Like(`${region}%`),
      },
      order: { rank: 'DESC' },
      take: 10,
    });
    return getMainRegion;
  }

  // place 지역 선택 후 대분류
  // 관광지 > A01,A02,A03
  // 쇼핑 > A04
  // 음식점 > A05
  // 숙박 > B02
  async getContent(region: string, content: string) {
    if (content === '관광지') {
      const getContent = await this.placeRepository.find({
        where: {
          address: Like(`${region}%`),
          cat1: In(['A01', 'A02', 'A03']),
        },
        order: { rank: 'DESC' },
        take: 10,
      });
      return getContent;
    } else if (content === '쇼핑') {
      const getContent = await this.placeRepository.find({
        where: {
          address: Like(`${region}%`),
          cat1: 'A04',
        },
        order: { rank: 'DESC' },
        take: 10,
      });
      return getContent;
    } else if (content === '음식점') {
      const getContent = await this.placeRepository.find({
        where: {
          address: Like(`${region}%`),
          cat1: 'A05',
        },
        order: { rank: 'DESC' },
        take: 10,
      });
      return getContent;
    } else if (content === '숙박') {
      const getContent = await this.placeRepository.find({
        where: {
          address: Like(`${region}%`),
          cat1: 'B02',
        },
        order: { rank: 'DESC' },
        take: 10,
      });
      return getContent;
    } else {
      throw new BadRequestException('잘못된 요청입니다 쇼핑,음식점,숙박,관광지 중 택하시오');
    }
  }
}
