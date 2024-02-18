import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaceService } from './place.service';
import { ConfigService } from '@nestjs/config';
import { CreatePlaceDto } from './dto/create-place.dto';
import { AuthGuard } from '@nestjs/passport';
import { addressMapping } from './utils/address.mapping';
// import { categoryMapping } from './utils/category.mapping';
import { ApiResponseDTO } from 'src/response/dto/api.response.dto';

@ApiTags('place')
@Controller('api/place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private configService: ConfigService,
  ) {}

  /**
   * place 지역별 ex)대표지역 전체(인기순)
   * @param region
   * @returns
   */
  @ApiOperation({ summary: '대표지역 전체(인기순)' })
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
  // contentTypeId
  // 관광지 12
  // 음식 39
  // 쇼핑 38
  // 숙박 32
  /**
   * place 지역별 ex)대표지역 전체(인기순)
   * @param region
   * @param content
   * @returns
   */
  @ApiOperation({ summary: '대표지역 + 관광,음식,쇼핑,숙박(인기순)' })
  @Get('/region/:region/content/:content')
  async getContent(
    @Param('region', ParseIntPipe) region: string,
    @Param('content', ParseIntPipe) content: number,
  ) {
    const data = await this.placeService.getContent(region, content);
    return {
      statusCode: HttpStatus.OK,
      message: `${region}지역 ${content} place 조회에 성공했습니다`,
      data,
    };
  }

  /**
   * place 지역별 ex)대표지역 전체(인기순)
   * @param placeId
   * @param contentTypeId
   * @returns
   */
  @ApiOperation({ summary: '주변 place 조회' })
  @Get('/aroundRegion/:placeId/contentTypeId/:contentTypeId')
  async getAroundRegions(
    @Param('placeId', ParseIntPipe) placeId: number,
    @Param('contentTypeId', ParseIntPipe) contentTypeId: number,
  ) {
    const data = await this.placeService.getAroundRegions(placeId, contentTypeId);

    return {
      statusCode: HttpStatus.OK,
      message: `주변 place 조회에 성공했습니다`,
      data,
    };
  }

  // api key 환경변수 보내기
  @Get('api-key')
  getApiKey() {
    const TOUR_API_KEY = this.configService.get<string>('TOUR_API_KEY');
    return TOUR_API_KEY;
  }
}
