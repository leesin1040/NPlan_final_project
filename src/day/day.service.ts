import { Schedule } from 'src/schedule/entities/schedule.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Day } from './entities/day.entity';
import { DayDto } from './dto/day.dto';
import { Place } from 'src/place/entities/place.entity';

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(Day)
    private readonly dayRepository: Repository<Day>,
    private dataSource: DataSource,
  ) {}

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

  // travel생성시 자동으로 Lists 생성
  async createDays(days: number, travelId: number) {
    const existDay = await this.dayRepository.findOne({
      where: { travel: { id: travelId } },
    });
    if (existDay) {
      throw new ConflictException('이미 해당 treval에 day가 존재합니다');
    }
    const createDays = [];
    try {
      for (let i = 1; i <= days; i++) {
        const createDay = this.dayRepository.create({
          day: i,
          travel: { id: travelId },
        });
        console.log(createDay);
        await this.dayRepository.save(createDay);
        createDays.push(createDay);
      }
    } catch (error) {
      console.error('Error in createDays:', error);
    }
    return createDays;
  }

  // Day 목록 조회
  async getDays(travelId: number) {
    const getDays = await this.dayRepository.find({
      where: { travel: { id: travelId } },
      order: { day: 'ASC' },
    });
    return getDays;
  }
  //   리스트 상세조회
  async getDay(travelId: number, dayId: number) {
    // 클릭한 리스트 안에 존재하는 카드들의 위치정보를  순서대로 반환해준다
    const getCards = await this.dayRepository.find({
      where: { id: dayId },
      relations: ['schedule.place'],
    });

    const getXY = [];
    getCards[0].schedule.forEach((a) => {
      getXY.push({
        X: a.place.mapX,
        Y: a.place.mapY,
        name: a.place.name,
        category: a.place.category,
        contentId: a.place.contentId,
      });
    });
    console.log(getXY);
    return getCards;
  }

  //   리스트삭제
  async deleteDay(dayId: number) {}
}
