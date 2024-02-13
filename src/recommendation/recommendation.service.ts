import { Schedule } from './../schedule/entities/schedule.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import { Place } from 'src/place/entities/place.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { Day } from 'src/day/entities/day.entity';
import { Like } from 'src/like/entities/like.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,

    // @InjectRepository(Travel)
    // private readonly travelRepository: Repository<Travel>,
    // @InjectRepository(Day)
    // private readonly dayRepository: Repository<Day>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private dataSource: DataSource,
  ) {}
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
      const radius = 10000;

      const oneFirstTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 NOT IN (:place)', { place: ['A05', 'B02', 'A03'] })
        .orderBy('RAND()')
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
        .andWhere('place.cat3 NOT IN (:cafe)', { cafe: 'A05020900' })
        .andWhere('ST_Distance_Sphere(place.placePoint, ST_GeomFromText(:beforePoint))<= :radius', {
          beforePoint: oneFirstTouristSpot.placePoint,
          radius: radius,
        })
        .orderBy('RAND()')
        .limit(10)
        .getMany();

      const oneSecondTouristSpot =
        oneSecondTouristSpots[Math.floor(Math.random() * oneSecondTouristSpots.length)];

      // cat1(B02제외) ->이전 장소 반경5km안 rank 1순위 14:00 ~ 16:00 관광지
      const oneThirdTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 NOT IN (:place)', { place: ['A05', 'B02', 'A04'] })
        .andWhere('CASE WHEN place.id = :firstPlaceId THEN 0 ELSE 1 END = 1', {
          firstPlaceId: oneFirstTouristSpot.id,
        })
        .andWhere('ST_Distance_Sphere(place.placePoint, ST_GeomFromText(:beforePoint))<= :radius', {
          beforePoint: oneSecondTouristSpot.placePoint,
          radius: radius,
        })
        .orderBy('RAND()')
        .limit(10)
        .getMany();

      const oneThirdTouristSpot =
        oneThirdTouristSpots[Math.floor(Math.random() * oneThirdTouristSpots.length)];

      // cat1(B02제외) ->이전 장소 반경5km안 rank 1순위 16:00 ~ 18:00 관광지
      const oneFourthTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 NOT IN (:place)', { place: ['B02', 'A05', 'A04'] })
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
        .orderBy('RAND()')
        .limit(10)
        .getMany();

      const oneFourthTouristSpot =
        oneFourthTouristSpots[Math.floor(Math.random() * oneFourthTouristSpots.length)];

      // cat1(A05) ->이전 장소 반경5km안 rank 1순위 18:00 ~ 20:00 음식점
      const oneFifthTouristSpots = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1 =:restaurant', { restaurant: 'A05' })
        .andWhere('place.cat3 NOT IN (:cafe)', { cafe: 'A05020900' })
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
        .orderBy('RAND()')
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
        .orderBy('RAND()')
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

  // 음식점추천
  async recommendationRestaurants(userId: number, region: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // region지역에 등록된 place들
      // placesInRegion를 돌면서 place.cat3와 place.id가져오자
      const placesInRegionSchedules = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.place', 'place')
        .where('place.areaCode = :region', { region: region })
        .andWhere('place.cat1=:cat1', { cat1: 'A05' })
        .getMany();
      const placesInRegion = placesInRegionSchedules.map((schedule) => schedule.place);

      // user가 등록한 place들
      // userPlaces 돌고 day돌면서 schedule의place들
      const userPlaces = await this.travelRepository
        .createQueryBuilder('travel')
        .where('travel.userId=:userId', { userId: userId })
        .leftJoinAndSelect('travel.day', 'day')
        .leftJoinAndSelect('day.schedule', 'schedule')
        .leftJoinAndSelect('schedule.place', 'place')
        .andWhere('place.areaCode = :region', { region: region })
        .andWhere('place.cat1=:cat1', { cat1: 'A05' })
        .getMany();
      const allSchedules = userPlaces.flatMap((travel) =>
        travel.day.flatMap((day) => day.schedule),
      );
      const places = allSchedules.map((schedule) => schedule.place);

      // // user가 like한 travel의 place들
      // const userLikePlaces = await this.likeRepository
      //   .createQueryBuilder('like')
      //   .where('like.userId=:userId', { userId: userId })
      //   .leftJoinAndSelect('like.article', 'article')
      //   .leftJoinAndSelect('article.travel', 'travel')
      //   .leftJoinAndSelect('travel.day', 'day')
      //   .leftJoinAndSelect('day.schedule', 'schedule')
      //   .leftJoinAndSelect('schedule.place', 'place')
      //   .andWhere('place.areaCode = :region', { region: region })
      //   .andWhere('place.cat1=:cat1', { cat1: 'A05' })
      //   .getMany();

      // console.log(userLikePlaces);

      const countByCat3InRegion = countByCat3(placesInRegion);
      const countByCat3InUserPlaces = countByCat3(places);

      const sortedCountByCat3InRegion = sortObjectByValue(countByCat3InRegion);
      const sortedCountByCat3InUserPlaces = sortObjectByValue(countByCat3InUserPlaces);

      console.log(sortedCountByCat3InRegion);
      console.log(sortedCountByCat3InUserPlaces);

      function countByCat3(places: any[]) {
        const countByCat3: Record<string, number> = {};
        places.forEach((place) => {
          const cat3 = place.cat3;
          countByCat3[cat3] = (countByCat3[cat3] || 0) + 1;
        });
        return countByCat3;
      }
      function sortObjectByValue(obj: Record<string, number>) {
        return Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]));
      }
      // console.log(userPlaces);

      // const places = await this.placeRepository
      //   .createQueryBuilder('place')
      //   .where({ areaCode: region, cat1: 'A05' })
      //   .getMany();

      // let minRank = 0;
      // let maxRank = 0;

      // places.forEach((place) => {
      //   const rank = place.rank;
      //   if (rank < minRank) minRank = rank;
      //   if (rank > maxRank) maxRank = rank;
      // });

      // const placeCatCounts: Record<string, number> = {};

      // const rankPlaceCatCounts: Record<string, number> = {};
      // places.forEach((place) => {
      //   const cat3Value = place.cat3;

      //   // 정규화된 가중치 계산
      //   // (해당값-최소값) /(최대값-최소값)
      //   const normalizedWeight = (place.rank - minRank) / (maxRank - minRank);
      //   const weightedRank = place.rank * normalizedWeight;
      //   placeCatCounts[cat3Value] = (placeCatCounts[cat3Value] || 0) + 1;
      //   rankPlaceCatCounts[cat3Value] = (rankPlaceCatCounts[cat3Value] || 0) + weightedRank;
      // });
      // console.log(placeCatCounts);
      // console.log(rankPlaceCatCounts);
      // // 가중치의 총 합을 계산
      // const totalWeight = Object.values(rankPlaceCatCounts).reduce(
      //   (sum, weight) => sum + weight,
      //   0,
      // );

      // // 각 카테고리의 가중치를 비율로 변환
      // const weightRatios = {};
      // for (const [category, weight] of Object.entries(rankPlaceCatCounts)) {
      //   weightRatios[category] = weight / totalWeight;
      // }

      // console.log(weightRatios);
      // const userPlaces = await this.travelRepository
      //   .createQueryBuilder('travel')
      //   .where({ userId: userId })
      //   .leftJoinAndSelect('travel.day', 'day')
      //   .leftJoinAndSelect('day.schedule', 'schedule')
      //   .leftJoinAndSelect('schedule.place', 'place')
      //   .andWhere('place.cat1 = :cat1', { cat1: 'A05' })
      //   .getMany();
      // const userCat3Counts: Record<string, number> = {};
      // userPlaces.forEach((userPlace) => {
      //   userPlace.day.forEach((day) => {
      //     day.schedule.forEach((schedule) => {
      //       const cat3Value = schedule.place.cat3;
      //       userCat3Counts[cat3Value] = (userCat3Counts[cat3Value] || 0) + 1;
      //     });
      //   });
      // });
      // console.log(userCat3Counts);
    } catch (error) {}
  }
  // 관광지 추천
  async recommendationAttractions(userId: number, region: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const places = await this.placeRepository
        .createQueryBuilder('place')
        .where('place.areaCode = :region', { region })
        .andWhere('place.cat1 IN (:...cat1)', { cat1: ['A01', 'A02', 'A04'] })
        .getMany();

      const placeCatCounts: Record<string, number> = {};
      places.forEach((place) => {
        const cat3Value = place.cat3;
        placeCatCounts[cat3Value] = (placeCatCounts[cat3Value] || 0) + 1;
      });

      console.log(placeCatCounts);

      const userPlaces = await this.travelRepository
        .createQueryBuilder('travel')
        .where({ userId: userId })
        .leftJoinAndSelect('travel.day', 'day')
        .leftJoinAndSelect('day.schedule', 'schedule')
        .leftJoinAndSelect('schedule.place', 'place')
        .where('place.cat1 IN (:...cat1)', { cat1: ['A01', 'A02', 'A04'] })
        .getMany();

      const userCat3Counts: Record<string, number> = {};
      userPlaces.forEach((userPlace) => {
        userPlace.day.forEach((day) => {
          day.schedule.forEach((schedule) => {
            const cat3Value = schedule.place.cat3;
            userCat3Counts[cat3Value] = (userCat3Counts[cat3Value] || 0) + 1;
          });
        });
      });
      console.log(userCat3Counts);
    } catch (error) {}
  }
  // 숙박 추천
  async recommendationAccommodations(userId: number, region: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const places = await this.placeRepository
        .createQueryBuilder('place')
        .where({ areaCode: region, cat1: 'B02' })
        .getMany();

      const placeCatCounts: Record<string, number> = {};
      places.forEach((place) => {
        const cat3Value = place.cat3;
        placeCatCounts[cat3Value] = (placeCatCounts[cat3Value] || 0) + 1;
      });

      console.log(placeCatCounts);

      const userPlaces = await this.travelRepository
        .createQueryBuilder('travel')
        .where({ userId: userId })
        .leftJoinAndSelect('travel.day', 'day')
        .leftJoinAndSelect('day.schedule', 'schedule')
        .leftJoinAndSelect('schedule.place', 'place')
        .andWhere('place.cat1 = :cat1', { cat1: 'B02' })
        .getMany();

      const userCat3Counts: Record<string, number> = {};
      userPlaces.forEach((userPlace) => {
        userPlace.day.forEach((day) => {
          day.schedule.forEach((schedule) => {
            const cat3Value = schedule.place.cat3;
            userCat3Counts[cat3Value] = (userCat3Counts[cat3Value] || 0) + 1;
          });
        });
      });
      console.log(userCat3Counts);
    } catch (error) {}
  }
}
