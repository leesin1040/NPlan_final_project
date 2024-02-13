import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LexoRank } from 'lexorank';
import { MoveScheduleDto } from './dto/move-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { Day } from 'src/day/entities/day.entity';
import { Place } from 'src/place/entities/place.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
  ) {}
  // 스케줄 생성
  async create(createScheduleDto: CreateScheduleDto) {
    const day = await this.dayRepository.find({ where: { id: createScheduleDto.dayId } });
    if (!day.length) throw new NotFoundException('해당하는 일차를 찾을 수 없습니다.');

    const place = await this.placeRepository.find({ where: { id: createScheduleDto.placeId } });
    if (!place.length) throw new NotFoundException('해당하는 장소를 찾을 수 없습니다.');

    const schedules = await this.findAllByDayId(createScheduleDto.dayId);
    if (schedules.length >= 7)
      throw new BadRequestException('한 일차에 스케줄은 7개를 초과할 수 없습니다.');

    // order 생성
    const newOrder = await this.getOrder(createScheduleDto.dayId);

    //  [ ]: 추후 save -> insert로 교체 가능성 있음
    return await this.scheduleRepository.save({
      dayId: createScheduleDto.dayId,
      placeId: createScheduleDto.placeId,
      order: newOrder,
    });
  }

  // 리스트별 스케줄 전체 조회
  async findAllByDayId(dayId: number) {
    const schedules = await this.scheduleRepository.find({
      where: { dayId },
      relations: ['place'],
      select: { placeId: true, order: true, id: true }, // 필요한 필드 선택
    });

    // LexoRank 기준으로 정렬
    schedules.sort((a, b) => {
      return LexoRank.parse(a.order).compareTo(LexoRank.parse(b.order));
    });

    return schedules;
  }

  // 단일 스케줄 상세 조회
  async findOne(id: number) {
    return await this.scheduleRepository.findOne({ where: { id }, relations: ['day', 'place'] });
  }

  // 스케줄 수정
  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.findOne(id);
    if (!schedule) throw new NotFoundException('해당하는 스케줄을 찾을 수 없습니다.');

    Object.assign(schedule, updateScheduleDto);

    //  [ ]: 추후 save -> insert로 교체 가능성 있음
    return await this.scheduleRepository.save(schedule);
  }

  // 스케줄 이동
  async move(id: number, moveScheduleDto: MoveScheduleDto) {
    const movedSchedule = await this.findOne(id);
    if (!movedSchedule) throw new NotFoundException('해당하는 스케줄을 찾을 수 없습니다.');

    const day = await this.dayRepository.find({ where: { id: moveScheduleDto.dayId } });
    if (!day.length) throw new NotFoundException('해당하는 일차를 찾을 수 없습니다.');

    // 스케줄이 있는 day의 id와 입력받은 dayId가 일치하지 않는다면(스케줄을 다른 일차로 옮기기)
    if (moveScheduleDto.dayId && movedSchedule.dayId !== moveScheduleDto.dayId) {
      const schedules = await this.findAllByDayId(moveScheduleDto.dayId);
      if (schedules.length >= 7)
        throw new BadRequestException('한 일차에 스케줄은 7개를 초과할 수 없습니다.');
      movedSchedule.dayId = moveScheduleDto.dayId;
    }

    let schedules = await this.findAllByDayId(movedSchedule.dayId);

    // 옮긴 day에 스케줄이 movedSchedule 하나라면 LexoRank 중앙값을 order에 저장 후 반환
    if (schedules.length === 1) {
      movedSchedule.order = LexoRank.middle().toString();

      //  [ ]: 추후 save -> insert로 교체 가능성 있음
      return await this.scheduleRepository.save(movedSchedule);
    }

    // 이동할 곳에 lexorank를 지정할 공간이 부족하다면 reOrdering 함수 호출
    // 첫 스케줄 전, 마지막 스케줄 후, 이동할 스케줄 앞뒤 스케줄의 사이
    if (
      LexoRank.parse(schedules[0].order).genPrev() >= LexoRank.parse(schedules[0].order) ||
      LexoRank.parse(schedules[schedules.length - 1].order).genNext() <=
        LexoRank.parse(schedules[schedules.length - 1].order) ||
      LexoRank.parse(schedules[moveScheduleDto.index - 1].order).between(
        LexoRank.parse(schedules[moveScheduleDto.index].order),
      ) === LexoRank.parse(schedules[moveScheduleDto.index - 1].order) ||
      LexoRank.parse(schedules[moveScheduleDto.index - 1].order).between(
        LexoRank.parse(schedules[moveScheduleDto.index].order),
      ) === LexoRank.parse(schedules[moveScheduleDto.index].order)
    ) {
      schedules = await this.reOrdering(movedSchedule.dayId);
    }

    // order값 수정
    if (moveScheduleDto.index === 0) {
      movedSchedule.order = LexoRank.parse(schedules[0].order).genPrev().toString();
    } else if (moveScheduleDto.index === schedules.length - 1) {
      movedSchedule.order = LexoRank.parse(schedules[schedules.length - 1].order)
        .genNext()
        .toString();
    } else {
      const prevSchedule = LexoRank.parse(schedules[moveScheduleDto.index - 1].order);
      const nextSchedule = LexoRank.parse(schedules[moveScheduleDto.index].order);
      movedSchedule.order = prevSchedule.between(nextSchedule).toString();
    }

    // 수정된 order, dayId 변경하여 저장
    //  [ ]: 추후 save -> insert로 교체 가능성 있음
    return await this.scheduleRepository.save(movedSchedule);
  }

  // 스케줄 삭제
  async remove(id: number) {
    const schedule = await this.scheduleRepository.findOne({ where: { id: id } });
    console.log(schedule);
    if (!schedule) throw new NotFoundException('해당하는 스케줄을 찾을 수 없습니다.');
    await this.scheduleRepository.delete({ id: id });
    return schedule;
  }

  // 스케줄 복사
  async clone(id: number) {
    const schedule = await this.findOne(id);
    if (!schedule) throw new NotFoundException('해당하는 스케줄을 찾을 수 없습니다.');

    const newOrder = await this.getOrder(schedule.dayId);

    return this.scheduleRepository.create({
      dayId: schedule.dayId,
      placeId: schedule.placeId,
      order: newOrder,
    });
  }

  // 스케줄 생성 시 정렬 순서를 저장할 수 있게 order 값 지정
  async getOrder(dayId: number) {
    const schedules = await this.findAllByDayId(dayId);

    let order: string;

    // day가 비어있으면 lexorank 중앙값, 아니라면 가장 마지막 order의 다음값(genNext()) 지정
    if (!schedules.length) order = LexoRank.middle().toString();
    else {
      const lastOne = await this.scheduleRepository.findOne({
        where: { dayId },
        order: { order: 'DESC' },
      });
      order = LexoRank.parse(lastOne.order).genNext().toString();
    }
    return order;
  }

  // order 재정렬
  async reOrdering(dayId: number) {
    const schedules = await this.findAllByDayId(dayId);

    let lexorank = LexoRank.middle();
    for (let i = 0; i < schedules.length; i++) {
      schedules[i].order = lexorank.toString();
      lexorank = lexorank.genNext();
    }

    //  [ ]: 추후 save -> insert로 교체 가능성 있음
    return await this.scheduleRepository.save(schedules);
  }
}
