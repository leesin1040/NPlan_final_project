import { Body, Controller, Get, HttpStatus, Patch, Post } from '@nestjs/common';

import { UpdatePlaceService } from './update.place.service';

@Controller('')
export class UpdatePlaceController {
  constructor(private readonly updatePlaceService: UpdatePlaceService) {}

  // place 전체조회
  @Patch('/api/uploadplace')
  async uploadPlaces() {
    const data = await this.updatePlaceService.uploadPlaces();
    return {
      statusCode: HttpStatus.CREATED,
      message: 'place 업데이트에 성공했습니다',
      data,
    };
  }

  // 여행지 업데이트 일단 서울만
}
