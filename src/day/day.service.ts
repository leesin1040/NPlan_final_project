import { Schedule } from 'src/schedule/entities/schedule.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Day } from './entities/day.entity';
import { DayDto } from './dto/day.dto';
import { Place } from 'src/place/entities/place.entity';
import { LexoRank } from 'lexorank';

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(Day)
    private readonly dayRepository: Repository<Day>,
    private dataSource: DataSource,
  ) {}

  // travel생성시 자동으로 Lists 생성
  async createDays(days: number, travelId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const existDay = await this.dayRepository.findOne({
        where: { travel: { id: travelId } },
      });
      if (existDay) {
        throw new Error('일차 생성 중 오류가 발생했습니다. 관리자에게 문의하십시오.');
      }
      const createDays = [];

      for (let i = 1; i <= days; i++) {
        const createDay = this.dayRepository.create({
          day: i,
          travel: { id: travelId },
        });
        await this.dayRepository.save(createDay);
        createDays.push(createDay);
      }
      await queryRunner.commitTransaction();
      return createDays;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error('일차 생성 중 오류가 발생했습니다. 관리자에게 문의하십시오.');
    }
  }

  // Day 목록 조회
  async getDays(travelId: number) {
    try {
      const getDays = await this.dayRepository.find({
        where: { travel: { id: travelId } },
        order: { day: 'ASC' },
        relations: ['schedule.place'],
      });
      if (getDays.length === 0) {
        throw new Error('전체일차 경로보기 중 오류가 발생했습니다. 관리자에게 문의하십시오.');
      }
      getDays.forEach((day) => {
        day.schedule.sort((a, b) => {
          return LexoRank.parse(a.order).compareTo(LexoRank.parse(b.order));
        });
      });
      return getDays;
    } catch (error) {
      throw new Error('전체일차 경로보기 중 오류가 발생했습니다. 관리자에게 문의하십시오.');
    }
  }

  //   리스트 상세조회
  async getDay(travelId: number, dayId: number) {
    try {
      // 클릭한 리스트 안에 존재하는 카드들의 위치정보를  순서대로 반환해준다
      const getCards = await this.dayRepository.findOne({
        where: { id: dayId },
        relations: ['schedule.place'],
      });

      if (getCards.schedule.length === 0) {
        throw new NotFoundException('여행일정이 존재하지 않습니다');
      }
      getCards.schedule.sort((a, b) => {
        return LexoRank.parse(a.order).compareTo(LexoRank.parse(b.order));
      });

      return getCards;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          '경로보기 중 오류가 발생했습니다. 관리자에게 문의하십시오.',
        );
      }
    }
  }

  // 리스트 생성
  // 일정 수정 도중에 일정이 늘어 날 수있음에 대비하여
  async createDay(travelId: number) {
    const existedLists = await this.dayRepository.find({
      where: { travel: { id: travelId } },
      order: { day: 'DESC' },
    });
    // 보드Id로 list전체가져옴
    let maxDay = 1;
    if (existedLists.length > 0) {
      maxDay = existedLists[0].day + 1;
    }
    const createList = this.dayRepository.create({
      day: maxDay,
      travel: { id: travelId },
    });
    return this.dayRepository.save(createList);
  }

  //   리스트삭제
  async deleteDay(dayId: number) {}

  // 경로생성
  async updateDirections(dayId: number, directions: string, placePath: string) {
    try {
      // 한 번의 update 호출로 두 속성을 함께 업데이트합니다.

      const updateResult = await this.dayRepository.update(
        { id: dayId },
        { directions: JSON.stringify(directions), placePath: JSON.stringify(placePath) },
      );

      return updateResult;
    } catch (error) {}
  }
}
