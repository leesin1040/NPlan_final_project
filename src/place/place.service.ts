import { CreatePlaceDto } from './dto/create-place.dto';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { In, IsNull, Like, Repository } from 'typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  // place 생성
  // [ ]: 추후 place entity에 따른 저장값 변경 or 사용하지 않는다면 폐기
  async createPlace(
    createPlaceDto: CreatePlaceDto,
    userId: number,
    sigunguCode: string,
    areaCode: string,
    cat1: string,
  ) {
    const existingPlace = await this.placeRepository.findOne({
      where: {
        user: { id: userId },
        name: createPlaceDto.name,
        address: createPlaceDto.address,
      },
    });
    if (existingPlace) {
      throw new ConflictException('중복된 값입니다');
    }
    const createdUserPlace = this.placeRepository.create({
      name: createPlaceDto.name,
      address: createPlaceDto.address,
      mapX: createPlaceDto.mapX,
      mapY: createPlaceDto.mapY,
      cat1: cat1,
      sigunguCode: sigunguCode,
      areaCode: areaCode,
      user: { id: userId },
      placePoint: `POINT(${createPlaceDto.mapX} ${createPlaceDto.mapY})`,
    });
    return await this.placeRepository.save(createdUserPlace);
  }

  async getMainRegion(areaCode: string) {
    const getMainRegion = await this.placeRepository.find({
      where: {
        areaCode,
        user: IsNull(),
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
        user: IsNull(),
      },
      order: { rank: 'DESC' },
      take: 10,
    });
    return getContent;
  }
}
