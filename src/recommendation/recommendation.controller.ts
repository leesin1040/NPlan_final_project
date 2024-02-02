import { Body, Controller, Get, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateRecommendationDto } from './dto/recommendation.dto';
import { TravelService } from 'src/travel/travel.service';

@Controller('')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post('api/recommendation')
  async createRecommendation(@Body() region: string) {
    // region를 사용하여 여행 계획을 생성하는 로직을 구현
    // region = '1';
    region = '31';
    const createdRecommendation = await this.recommendationService.createRecommendation(region);
    return {
      status: HttpStatus.CREATED,
      data: createdRecommendation,
    };
  }

  // 로그인해야만함
  // 그사람의 travel day schdule
  // travel title,color,region,theme,start_date end_date
  // day는 days
  // schdule dayId placeId
  // @UseGuards(AuthGuard('jwt'))
  // @Post('api/recommendation')
  // async createRecommendation(@Req() req, @Body() createRecommendationDto: CreateRecommendationDto) {
  //   const userId = req.user.id;
  //   let travelRegion;
  //   if (createRecommendationDto.region === '1') {
  //     travelRegion = '서울';
  //   }
  //   const createTravelDto = {
  //     title: `강추 ${travelRegion}여행`,
  //     color: '#f2f2f2',
  //     region: `${travelRegion}`,
  //     theme: '음식',
  //     start_date: new Date('2024-02-02'),
  //     end_date: new Date('2024-02-03'),
  //   };
  //   const data = await this.travelService.create(userId, createTravelDto);
  //   // region를 사용하여 여행 계획을 생성하는 로직을 구현
  //   // region = '1';
  //   createRecommendationDto.region = '31';
  //   const createdRecommendation = await this.recommendationService.createRecommendation(
  //     createRecommendationDto.region,
  //   );
  //   return {
  //     status: HttpStatus.CREATED,
  //     data: createdRecommendation,
  //   };
  // }
}
