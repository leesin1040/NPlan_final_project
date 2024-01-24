import { Controller, Get, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlaceService } from './place.service';

@ApiTags('place')
@Controller('api/place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}
  // place 전체조회
  @Get('')
  async getAddress() {
    const data = await this.placeService.getAddress();
    return {
      statusCode: HttpStatus.CREATED,
      message: 'place 조회에 성공했습니다',
      data,
    };
  }
  // place 지역별 ex)서울,경기,경남,경북
  @Get('/asd')
  async getMainRegion() {
    const region = '경기';
    const data = await this.placeService.getMainRegion(region);
    return {
      statusCode: HttpStatus.CREATED,
      message: `${region}의 place 조회에 성공했습니다`,
      data,
    };
  }
}
