import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DayDto } from './dto/day.dto';
import { DayService } from './day.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Day')
@Controller('api')
export class DayController {
  constructor(private readonly dayService: DayService) {}
  // day Create
  // travel생성시 자동으로 Days 생성
  /**
   * 여행보드 생성시 일차 자동생성
   * @param days
   * @param travelId
   * @returns
   */
  @ApiOperation({ summary: '여행보드 생성시 일차 자동생성' })
  @Post('/travel/:travelId/days')
  async createDays(
    @Body('days', ParseIntPipe) days: number,
    @Param('travelId', ParseIntPipe) travelId: number,
  ) {
    const data = await this.dayService.createDays(days, travelId);
    return {
      statusCode: HttpStatus.CREATED,
      message: `${days}일 기간의 day 생성에 성공했습니다`,
      data,
    };
  }

  // 일정 수정 도중에 일정이 늘어 날 수있음에 대비하여
  /**
   * 일차리스트 생성
   * @param travelId
   * @returns
   */
  @ApiOperation({ summary: '일차리스트 생성' })
  @Post('/travel/:travelId/day')
  async createDay(@Param('travelId', ParseIntPipe) travelId: number) {
    const data = await this.dayService.createDay(travelId);
    return {
      statusCode: HttpStatus.CREATED,
      message: `${data.day}일차 생성에 성공했습니다`,
      data,
    };
  }

  // day 목록 조회
  /**
   * 일차리스트 목록 조회
   * @param travelId
   * @returns
   */
  @ApiOperation({ summary: '일차리스트 목록 조회' })
  @Get('/travel/:travelId/day')
  async getDays(@Param('travelId', ParseIntPipe) travelId: number) {
    const data = await this.dayService.getDays(travelId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'day 조회에 성공했습니다',
      data,
    };
  }
  // day 상세조회
  // day를 클릭 했을 시 일정들의 동선을 지도에 나타내주는 api
  /**
   * 일차리스트 상세조회
   * @param travelId
   * @param dayId
   * @returns
   */
  @ApiOperation({ summary: '일차리스트 클릭시 일정 동선 지도에 표기' })
  @Get('/travel/:travelId/day/:dayId')
  async getDay(
    @Param('travelId', ParseIntPipe) travelId: number,
    @Param('dayId', ParseIntPipe) dayId: number,
  ) {
    const data = await this.dayService.getDay(travelId, dayId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'day 조회에 성공했습니다',
      data,
    };
  }

  // day 삭제
  // 삭제라기보다는 컬럼안에 내용을 삭제하는것 근데 이것은 card에 들어가야하는지
  // 아님 day에 들어가야하는지
  /**
   * 일차 리스트 삭제
   * @param dayId
   * @returns
   */
  @ApiOperation({ summary: '일차리스트 삭제' })
  @Delete('/day/:dayId')
  async deleteDay(@Param('dayId', ParseIntPipe) dayId: number) {
    const data = await this.dayService.deleteDay(dayId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'day를 삭제에 성공했습니다',
      data,
    };
  }
}
