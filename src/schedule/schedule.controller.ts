import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { MoveScheduleDto } from './dto/move-schedule.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('스케쥴')
@Controller('api/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * 스케쥴 생성
   * @param createScheduleDto
   * @returns
   */
  @ApiOperation({ summary: '스케줄 생성' })
  @ApiBearerAuth()
  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    const data = await this.scheduleService.create(createScheduleDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: `스케줄 생성에 성공했습니다.`,
      data,
    };
  }

  // 단일 스케줄 상세 조회
  @ApiOperation({ summary: '단일 스케줄 상세조회' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.scheduleService.findOne(+id);

    return {
      statusCode: HttpStatus.OK,
      message: `스케줄 조회에 성공했습니다.`,
      data,
    };
  }

  // 스케줄 수정
  @ApiOperation({ summary: '스케줄 수정' })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateScheduleDto: UpdateScheduleDto) {
    const data = await this.scheduleService.update(+id, updateScheduleDto);

    return {
      statusCode: HttpStatus.OK,
      message: `스케줄 수정에 성공했습니다.`,
      data,
    };
  }

  // 스케줄 이동
  @ApiOperation({ summary: '스케줄 이동' })
  @Patch('move/:id')
  async move(@Param('id') id: number, @Body() moveScheduleDto: MoveScheduleDto) {
    const data = await this.scheduleService.move(+id, moveScheduleDto);

    return {
      statusCode: HttpStatus.OK,
      message: `스케줄 이동에 성공했습니다.`,
      data,
    };
  }

  // 스케줄 삭제
  @ApiOperation({ summary: '스케줄 삭제' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.scheduleService.remove(id);

      return {
        statusCode: HttpStatus.OK,
        message: `스케줄 삭제에 성공했습니다.`,
        data,
      };
    } catch (error) {
      return error.message;
    }
  }

  // 스케줄 복사
  @ApiOperation({ summary: '스케줄 복사' })
  @Post('clone/:id')
  async clone(@Param() id: number) {
    const data = await this.scheduleService.clone(+id);

    return {
      statusCode: HttpStatus.CREATED,
      message: `스케줄 복사에 성공했습니다.`,
      data,
    };
  }
}
