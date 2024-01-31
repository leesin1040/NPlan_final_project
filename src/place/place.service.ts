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

  // [ ]: 추후 지역 별 place 찾기 기준을 address가 아닌 areaCode로 변경할 수 있음
  async getMainRegion(areaCode: string) {
    const region = this.getRegion(areaCode);
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

  // [ ]: 추후 카테고리 별 place 찾기 request값을 cat1 별로 (cat2 추가 가능) 나눌 수 있음
  async getContent(areaCode: string, category: string) {
    const region = this.getRegion(areaCode);
    const content = this.getCategory(category);
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

  // 지역코드에 따른 지역string 반환
  getRegion(areaCode: string) {
    let region = '';

    if (areaCode === '1') region = '서울';
    else if (areaCode === '2') region = '인천';
    else if (areaCode === '3') region = '대전';
    else if (areaCode === '4') region = '대구';
    else if (areaCode === '5') region = '광주';
    else if (areaCode === '6') region = '부산';
    else if (areaCode === '7') region = '울산';
    else if (areaCode === '8') region = '세종';
    else if (areaCode === '31') region = '경기';
    else if (areaCode === '32') region = '강원';
    else if (areaCode === '33') region = '충청북도';
    else if (areaCode === '34') region = '충청남도';
    else if (areaCode === '35') region = '경상북도';
    else if (areaCode === '36') region = '경상남도';
    else if (areaCode === '37') region = '전라북도';
    else if (areaCode === '38') region = '전라남도';
    else if (areaCode === '39') region = '제주';

    return region;
  }

  // 대분류에 따른 카테고리 반환
  getCategory(cat1: string) {
    let content = '';

    if (cat1 === 'A01' || cat1 === 'A02' || cat1 === 'A03') content = '관광지';
    else if (cat1 === 'A04') content = '쇼핑';
    else if (cat1 === 'A05') content = '음식점';
    else if (cat1 === 'B02') content = '숙박';

    return content;
  }
}
