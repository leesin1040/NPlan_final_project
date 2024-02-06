import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { ConfigService } from '@nestjs/config';
import { CreatePlaceDto } from './dto/create-place.dto';

@ApiTags('place')
@Controller('api/place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private configService: ConfigService,
  ) {}

  // place 생성
  @ApiOperation({ summary: '스케줄 생성' })
  @Post('')
  async createPlace(@Body() createPlaceDto: CreatePlaceDto) {
    const data = await this.placeService.createPlace(createPlaceDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: `플레이스 생성에 성공했습니다.`,
      data,
    };
  }

  // place 전체조회
  @Get('')
  async getAddress() {
    const data = await this.placeService.getAddress();
    return {
      statusCode: HttpStatus.OK,
      message: 'place 조회에 성공했습니다',
      data,
    };
  }

  // place 지역별 ex)서울,경기,경남,경북
  @Get('/region/:region')
  async getMainRegion(@Param('region') region: string) {
    const data = await this.placeService.getMainRegion(region);
    return {
      statusCode: HttpStatus.OK,
      message: `${region}의 place 조회에 성공했습니다`,
      data,
    };
  }

  // place 지역 선택 후 대분류
  // ex) 서울 -> 음식점 or 경기 -> 숙박
  // 관광지 > A01,A02,A03
  // 쇼핑 > A04
  // 음식점 > A05
  // 숙박 > B02
  @Post('/region/:region/content/:content')
  async getContent(@Param('region') region: string, @Param('content') content: string) {
    const data = await this.placeService.getContent(region, content);
    return {
      statusCode: HttpStatus.OK,
      message: `${region}지역 ${content} place 조회에 성공했습니다`,
      data,
    };
  }
  // # 1	서울
  // # 2	인천
  // # 3	대전
  // # 4	대구
  // # 5	광주
  // # 6	부산
  // # 7	울산
  // # 8	세종
  // # 31	경기
  // # 32	강원
  // # 33	충북
  // # 34	충남
  // # 35	경북
  // # 36	경남
  // # 37	전북
  // # 38	전남
  // # 39	제주

  // api key 환경변수 보내기
  @Get('api-key')
  getApiKey() {
    const TOUR_API_KEY = this.configService.get<string>('TOUR_API_KEY');
    return TOUR_API_KEY;
  }
}
