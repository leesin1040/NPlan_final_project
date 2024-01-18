import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { TravelService } from './travel.service';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('여행보드')
@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}
  /**
   * 여행 생성
   * @param createTravelDto
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createTravel(@Req() req, @Body() createTravelDto: CreateTravelDto) {
    const user_id = req.user.id;
    const data = this.travelService.create(user_id, createTravelDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '여행보드 생성에 성공하였습니다.',
      data,
    };
  }

  @Get()
  findAll() {
    return this.travelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.travelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTravelDto: UpdateTravelDto) {
    return this.travelService.update(+id, updateTravelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelService.remove(+id);
  }
}
