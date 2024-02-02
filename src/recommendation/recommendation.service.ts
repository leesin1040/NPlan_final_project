import { Schedule } from './../schedule/entities/schedule.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import { Place } from 'src/place/entities/place.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { Day } from 'src/day/entities/day.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    // @InjectRepository(Travel)
    // private readonly travelRepository: Repository<Travel>,
    // @InjectRepository(Day)
    // private readonly dayRepository: Repository<Day>,
    // @InjectRepository(Schedule)
    // private readonly scheduleRepository: Repository<Schedule>,
    private dataSource: DataSource,
  ) {}

  async createRecommendation(region: string) {
    // 1일차 place에서 areaCode(region)
    // cat(B02제외 쇼핑몰,백화점 제외) -> region내에 1순위 관광지 10:00 ~ 12:00
    // cat1(A05) ->이전 장소 반경5km안 rank 1순위 12:00 ~ 14:00 음식점
    // cat1(B02제외) ->이전 장소 반경5km안 rank 1순위 14:00 ~ 16:00 관광지
    // cat1(B02제외) ->이전 장소 반경5km안 rank 1순위 16:00 ~ 18:00 관광지
    // cat1(A05) ->이전 장소 반경5km안 rank 1순위 18:00 ~ 20:00 음식점
    // cat1(B02) ->이전 장소 반경5km안 rank 1순위  숙소
    // 저장할공간
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const schedules = [];
      const radius = 5000;

      const oneFirstTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 NOT IN (:place)', { place: ['A05', 'B02', 'A03'] })
        .andWhere('place.category NOT IN (:category)', { category: '테마공원' })
        .andWhere('place.category NOT IN (:shopping)', { shopping: ['쇼핑몰', '백화점'] })
        .orderBy('place.rank', 'DESC')
        .limit(10)
        .getMany();
      const oneFirstTouristSpot =
        oneFirstTouristSpots[Math.floor(Math.random() * oneFirstTouristSpots.length)];
      console.log(oneFirstTouristSpot);

      // cat1(A05) ->이전 장소 반경5km안 rank 1순위 12:00 ~ 14:00 음식점
      const oneSecondTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 =:restaurant', { restaurant: 'A05' })
        .andWhere('place.category NOT IN (:cafe)', { cafe: '카페/찻집' })
        .andWhere('ST_Distance_Sphere(place.placePoint, ST_GeomFromText(:beforePoint))<= :radius', {
          beforePoint: oneFirstTouristSpot.placePoint,
          radius: radius,
        })
        .orderBy('place.rank', 'DESC')
        .limit(10)
        .getMany();

      const oneSecondTouristSpot =
        oneSecondTouristSpots[Math.floor(Math.random() * oneSecondTouristSpots.length)];

      // cat1(B02제외) ->이전 장소 반경5km안 rank 1순위 14:00 ~ 16:00 관광지
      const oneThirdTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 NOT IN (:place)', { place: ['A05', 'B02'] })
        .andWhere('place.category NOT IN (:shopping)', { shopping: ['쇼핑몰', '백화점'] })
        .andWhere('CASE WHEN place.id = :firstPlaceId THEN 0 ELSE 1 END = 1', {
          firstPlaceId: oneFirstTouristSpot.id,
        })
        .andWhere('ST_Distance_Sphere(place.placePoint, ST_GeomFromText(:beforePoint))<= :radius', {
          beforePoint: oneSecondTouristSpot.placePoint,
          radius: radius,
        })
        .orderBy('place.rank', 'DESC')
        .limit(10)
        .getMany();

      const oneThirdTouristSpot =
        oneThirdTouristSpots[Math.floor(Math.random() * oneThirdTouristSpots.length)];

      // cat1(B02제외) ->이전 장소 반경5km안 rank 1순위 16:00 ~ 18:00 관광지
      const oneFourthTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 NOT IN (:place)', { place: ['B02', 'A05'] })
        .andWhere('place.category NOT IN (:shopping)', { shopping: ['쇼핑몰', '백화점'] })
        .andWhere(
          'CASE WHEN place.id = :firstPlaceId OR place.id =:secondPlaceId OR place.id = :thirdPlaceId THEN 0 ELSE 1 END = 1',
          {
            firstPlaceId: oneFirstTouristSpot.id,
            secondPlaceId: oneSecondTouristSpot.id,
            thirdPlaceId: oneThirdTouristSpot.id,
          },
        )
        .andWhere('ST_Distance_Sphere(place.placePoint, ST_GeomFromText(:beforePoint))<= :radius', {
          beforePoint: oneThirdTouristSpot.placePoint,
          radius: radius,
        })
        .orderBy('place.rank', 'DESC')
        .limit(10)
        .getMany();

      const oneFourthTouristSpot =
        oneFourthTouristSpots[Math.floor(Math.random() * oneFourthTouristSpots.length)];

      // cat1(A05) ->이전 장소 반경5km안 rank 1순위 18:00 ~ 20:00 음식점
      const oneFifthTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 =:restaurant', { restaurant: 'A05' })
        .andWhere('place.category NOT IN (:cafe)', { cafe: '카페/찻집' })
        .andWhere(
          'CASE WHEN place.id = :firstPlaceId OR place.id =:secondPlaceId OR place.id = :thirdPlaceId OR place.id = :fourthPlaceId   THEN 0 ELSE 1 END = 1',
          {
            firstPlaceId: oneFirstTouristSpot.id,
            secondPlaceId: oneSecondTouristSpot.id,
            thirdPlaceId: oneThirdTouristSpot.id,
            fourthPlaceId: oneFourthTouristSpot.id,
          },
        )
        .andWhere('ST_Distance_Sphere(place.placePoint, ST_GeomFromText(:beforePoint))<= :radius', {
          beforePoint: oneFourthTouristSpot.placePoint,
          radius: radius,
        })
        .orderBy('place.rank', 'DESC')
        .limit(10)
        .getMany();

      const oneFifthTouristSpot =
        oneFifthTouristSpots[Math.floor(Math.random() * oneFifthTouristSpots.length)];

      // cat1(B02) ->이전 장소 반경5km안 rank 1순위  숙소
      const oneSixthTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 =:hotel', { hotel: 'B02' })
        .andWhere('ST_Distance_Sphere(place.placePoint, ST_GeomFromText(:beforePoint))<= :radius', {
          beforePoint: oneFifthTouristSpot.placePoint,
          radius: radius,
        })
        .orderBy('place.rank', 'DESC')
        .limit(10)
        .getMany();

      const oneSixthTouristSpot =
        oneSixthTouristSpots[Math.floor(Math.random() * oneSixthTouristSpots.length)];

      schedules.push(oneFirstTouristSpot);
      schedules.push(oneSecondTouristSpot);
      schedules.push(oneThirdTouristSpot);
      schedules.push(oneFourthTouristSpot);
      schedules.push(oneFifthTouristSpot);
      schedules.push(oneSixthTouristSpot);
      await queryRunner.commitTransaction();
      return schedules;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // await this.createRecommendation(region);
    }
  }
}
//   간단한 컨텐츠기반 추천시스템
//   추천한 장소 주변 반경 몇km안에 다음장소 추천 이런식

//   일단 1박 2일만 구현

//   지역만 입력
//   테마는 나중
//   이동시간 제외

//   장소하나당 머무는 시간 2시간
//   점심시간 12:00 시작
//   저녁시간 18:00 시작
//   저녁먹고 숙소로 가정
//   맨마지막은 숙소

//   관광지같은 경우 10:00~16:00이라고 가정//안할수도
//   요금은 아몰랑
