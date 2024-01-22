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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('여행보드')
@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  /**
   * 여행보드 생성
   * @param req
   * @param createTravelDto
   * @returns
   */
  @ApiOperation({ summary: '여행보드 생성' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createTravel(@Req() req, @Body() createTravelDto: CreateTravelDto) {
    const userId = req.user.id;
    const data = await this.travelService.create(userId, createTravelDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '여행보드 생성에 성공하였습니다.',
      data,
    };
  }

  /**
   * 여행보드 전체 조회
   * @param req
   * @returns
   */
  @ApiOperation({ summary: '여행보드 전체조회' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    const data = await this.travelService.findAll(userId);
    return {
      statusCode: HttpStatus.FOUND,
      message: '유저가 포함된 여행보드 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 여행보드 상세조회
   * @param id
   * @param req
   * @returns
   */
  @ApiOperation({ summary: '여행보드 상세조회' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    const data = await this.travelService.findOneTravel(id, userId);
    return {
      statusCode: HttpStatus.FOUND,
      message: '여행보드 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 여행보드 수정
   * @param id
   * @param req
   * @param updateTravelDto
   * @returns
   */
  @ApiOperation({ summary: '여행보드 수정' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: number, @Req() req, @Body() updateTravelDto: UpdateTravelDto) {
    const userId = req.user.id;
    const data = this.travelService.update(id, userId, updateTravelDto);
    return {
      statusCode: HttpStatus.OK,
      message: '여행보드 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 여행보드 삭제
   * @param id
   * @param req
   * @returns
   */
  @ApiOperation({ summary: '여행보드 삭제' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    const deletedData = await this.travelService.remove(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: '여행보드 삭제에 성공했습니다.',
      deletedData,
    };
  }
}
