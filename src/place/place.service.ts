import { CreatePlaceDto } from './dto/create-place.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  // place 생성
  // [ ]: 추후 place entity에 따른 저장값 변경 or 사용하지 않는다면 폐기
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

  async getMainRegion(areaCode: string) {
    const getMainRegion = await this.placeRepository.find({
      where: {
        areaCode,
      },
      order: { rank: 'DESC' },
      take: 10,
    });
    return getMainRegion;
  }

  async getContent(areaCode: string, category: string) {
    const getContent = await this.placeRepository.find({
      where: {
        areaCode,
        cat1: category,
      },
      order: { rank: 'DESC' },
      take: 10,
    });
    return getContent;
  }
}
