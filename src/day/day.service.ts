import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Day } from './entities/day.entity';
import { DayDto } from './dto/day.dto';

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
  async createDays(travelId: number, days: number) {
    const createDays = [];
    // 보드Id로 list전체가져옴
    for (let i = 1; i <= days; i++) {
      const createDay = this.dayRepository.create({
        day: i,
        travel: { id: travelId },
      });
      this.dayRepository.save(createDay);
      createDays.push(createDay);
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
    const getCards = this.dayRepository.find({
      where: { id: dayId },
    });
  }

  //   리스트삭제
  async deleteDay(dayId: number) {}
}
