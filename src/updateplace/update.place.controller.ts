import { Body, Controller, Get, HttpStatus, Patch, Post } from '@nestjs/common';

import { UpdatePlaceService } from './update.place.service';

@Controller('')
export class UpdatePlaceController {
  constructor(private readonly updatePlaceService: UpdatePlaceService) {}

  // place 전체조회
  @Patch('/api/updateplace')
  async updatePlaces() {
    await this.updatePlaceService.updatePlaces();
    return {
      statusCode: HttpStatus.CREATED,
      message: 'place 업데이트에 성공했습니다',
    };
  }
}
