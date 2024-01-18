import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { MoveScheduleDto } from './dto/move-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // 스케줄 생성
  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  // 리스트별 스케줄 전체 조회
  @Get(':day_id')
  findAllByDayId(@Param('day_id') day_id: number) {
    return this.scheduleService.findAllByDayId(+day_id);
  }

  // 단일 스케줄 상세 조회
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.scheduleService.findOne(+id);
  }

  // 스케줄 수정
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  // 스케줄 이동
  @Patch(':id')
  move(@Param('id') id: number, @Body() moveScheduleDto: MoveScheduleDto) {
    return this.scheduleService.move(+id, moveScheduleDto);
  }

  // 스케줄 삭제
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.scheduleService.remove(+id);
  }
}
