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
  // 음식점 추천
  @UseGuards(AuthGuard('jwt'))
  @Get('api/recommendation/restaurant')
  async recommendationRestaurants(@Req() req, @Body() region: string) {
    region = '1';
    const userId = req.user.id;
    const data = await this.recommendationService.recommendationRestaurants(userId, region);
    try {
    } catch (error) {}
  }
  // 관광지 추천
  @UseGuards(AuthGuard('jwt'))
  @Get('api/recommendation/attractions')
  async recommendationAttractions(@Req() req, @Body() region: string) {
    region = '1';
    const userId = req.user.id;
    const data = await this.recommendationService.recommendationAttractions(userId, region);
    try {
    } catch (error) {}
  }
  // 숙박 추천
  @UseGuards(AuthGuard('jwt'))
  @Get('api/recommendation/accommodation')
  async recommendationAccommodations(@Req() req, @Body() region: string) {
    region = '1';
    const userId = req.user.id;
    const data = await this.recommendationService.recommendationAccommodations(userId, region);
    try {
    } catch (error) {}
  }
}
