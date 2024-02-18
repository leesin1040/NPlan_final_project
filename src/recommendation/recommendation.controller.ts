import { Body, Controller, Get, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { ApiResponseDTO } from 'src/response/dto/api.response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  // 1. 선택한 지역에 등록된 place들의 cat3값들 싹다가져와
  // 2. 내가 like누른 place , 내가등록한 place들의 카테고리 가중치 높게
  // 3. 내가 like누른 place는 무조건상위권
  // 4. 다녀온여행목록은 재외
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
