import { Schedule } from './../schedule/entities/schedule.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import { Place } from 'src/place/entities/place.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { Day } from 'src/day/entities/day.entity';
import { Like } from 'src/like/entities/articlelike.entity';

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
