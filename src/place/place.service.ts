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

  async getMainRegion(region: string) {
    console.log(region);
    const getMainRegion = await this.placeRepository.find({
      where: {
        areaCode: region,
        user: IsNull(),
      },
      order: { rank: 'DESC' },
      take: 10,
    });
    return getMainRegion;
  }
  async getContent(region: string, content: string) {
    // 해당 지역 및 카테고리에 대한 음식점 가져오기
    const places = await this.placeRepository
      .createQueryBuilder('place')
      .where({ areaCode: region, cat1: content })
      .getMany();

    // 최소 및 최대 rank 값 계산
    let minRank = 0;
    let maxRank = 0;
    places.forEach((place) => {
      const rank = place.rank;
      if (rank < minRank) minRank = rank;
      if (rank > maxRank) maxRank = rank;
    });

    // 각 음식점에 대한 가중치
    const rankPlaceCatCounts: Record<string, number> = {};
    places.forEach((place) => {
      const cat3Value = place.cat3;

      // 정규화된 rank 가중치 계산
      const normalizedWeight = (place.rank - minRank) / (maxRank - minRank);
      const weightedRank = place.rank * normalizedWeight;
      rankPlaceCatCounts[cat3Value] = (rankPlaceCatCounts[cat3Value] || 0) + weightedRank;
    });
    console.log(rankPlaceCatCounts);
    // 각 카테고리의 가중치를 비율로 변환
    const totalWeight = Object.values(rankPlaceCatCounts).reduce((sum, weight) => sum + weight, 0);
    const weightRatios: Record<string, number> = {};
    for (const [category, weight] of Object.entries(rankPlaceCatCounts)) {
      weightRatios[category] = weight / totalWeight;
    }
    console.log(weightRatios);
    // 각 카테고리별로 정렬된 음식점 가져오기 (가중치에 따라 정렬)
    const sortedPlaces: Record<string, Place[]> = {};
    for (const [category, weightRatio] of Object.entries(weightRatios)) {
      // 해당 카테고리의 음식점들을 가중치에 따라 정렬
      const categoryPlaces = places.filter((place) => place.cat3 === category);
      const sortedCategoryPlaces = categoryPlaces.sort((a, b) => b.rank - a.rank); // 내림차순 정렬

      // 비율에 따라 상위 10개씩 선택
      const numToSelect = Math.ceil(100 * weightRatio);
      sortedPlaces[category] = sortedCategoryPlaces.slice(0, numToSelect);
    }

    // 결과 배열 생성
    let result: Place[] = [];
    for (const places of Object.values(sortedPlaces)) {
      result.push(...places);
    }
    // 결과 배열을 rank 기준으로 내림차순으로 정렬
    result = result.sort((a, b) => b.rank - a.rank);

    // 상위 10개만 선택
    result = result.slice(0, 30);
    return result;
  }
}
