import { Body, Controller, Get, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { ApiResponseDTO } from 'src/response/dto/api.response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('api/recommendationTravel')
  async createRecommendation(@Body() region: string) {
    // region를 사용하여 여행 계획을 생성하는 로직을 구현
    region = '1';
    // region = '31';
    try {
      const data = await this.recommendationService.createRecommendation(region);
      return new ApiResponseDTO<any>(HttpStatus.CREATED, '데이터타입 테스트', data);
    } catch (error) {
      return new ApiResponseDTO<any>(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  // 컨텐츠 기반 추천 시스템
  // 사용자가 이전에 구매한 상품중에서 좋아하는 상품들과 유사한 상품들을 추천
  // 사용자의 선호도 관광지,음식점(like누른travel들의 place들,자신이 등록한place들 각각 가중치 다르게) 각각 벡터 생성
  // 전체 관광지,음식점 (rank의 표준편차를 구해 가중치로 적용) 각각 벡터 생성
  // 2개의 코사인유사도로 여행지 추출 -> 유사한것들부터 추천
  @UseGuards(AuthGuard('jwt'))
  @Get('api/recommendationPlace')
  async createRecommendationPlace(@Req() req, @Body() region: string) {
    region = '1';
    const userId = req.user.id;
    const data = await this.recommendationService.createRecommendationPlace(userId, region);
    try {
    } catch (error) {}
  }
}
