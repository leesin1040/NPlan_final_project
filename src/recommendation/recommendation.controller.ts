import { Body, Controller, Get, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { ApiResponseDTO } from 'src/response/dto/api.response.dto';

@Controller('')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('api/recommendation')
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
}
