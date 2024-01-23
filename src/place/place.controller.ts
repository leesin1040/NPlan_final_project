import { Controller, Get, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlaceService } from './place.service';

@ApiTags('place')
@Controller('api/place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get('')
  async getAddress() {
    const data = await this.placeService.getAddress();
    return {
      statusCode: HttpStatus.CREATED,
      message: 'place 조회에 성공했습니다',
      data,
    };
  }
}
