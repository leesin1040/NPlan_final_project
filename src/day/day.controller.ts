import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DayService } from './day.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseDTO } from 'src/response/dto/api.response.dto';

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
    try {
      const data = await this.dayService.createDays(days, travelId);
      return new ApiResponseDTO<any>(
        HttpStatus.CREATED,
        `${days}일 기간의 day 생성에 성공했습니다`,
        data,
      );
    } catch (error) {
      return new ApiResponseDTO<any>(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  // day 전체목록 조회(day전체보기 위함)
  /**
   * 일차리스트 목록 조회
   * @param travelId
   * @returns
   */
  @ApiOperation({ summary: '일차리스트 목록 조회' })
  @Get('/travel/:travelId/day')
  async getDays(@Param('travelId', ParseIntPipe) travelId: number) {
    try {
      const data = await this.dayService.getDays(travelId);
      return new ApiResponseDTO<any>(HttpStatus.OK, 'day 조회에 성공했습니다', data);
    } catch (error) {
      return new ApiResponseDTO<any>(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
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
    try {
      const data = await this.dayService.getDay(travelId, dayId);
      return new ApiResponseDTO<any>(HttpStatus.OK, 'day 상세조회에 성공했습니다', data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new ApiResponseDTO<any>(HttpStatus.NOT_FOUND, error.message);
      } else if (error instanceof InternalServerErrorException) {
        return new ApiResponseDTO<any>(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }
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
      statusCode: HttpStatus.OK,
      message: 'day를 삭제에 성공했습니다',
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
    try {
      const data = await this.dayService.createDay(travelId);
      return new ApiResponseDTO<any>(
        HttpStatus.CREATED,
        `${data.day}일차 생성에 성공했습니다`,
        data,
      );
    } catch (error) {
      return new ApiResponseDTO<any>(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  /**
   * 경로보기 생성
   * @param travelId
   * @param dayId
   * @body placePath
   * @returns
   */
  @ApiOperation({ summary: '경로보기 생성' })
  @Patch('/travel/:travelId/day/:dayId/directions')
  async updateDirections(
    @Param('dayId', ParseIntPipe) dayId: number,
    @Body('directions') directions: string,
    @Body('placePath') placePath: string,
  ) {
    try {
      const data = await this.dayService.updateDirections(dayId, directions, placePath);
      return new ApiResponseDTO<any>(HttpStatus.CREATED, `일차 경로 생성에 성공했습니다`, data);
    } catch (error) {}
  }
}
