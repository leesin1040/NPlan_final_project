import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dtos/changepassword.dto';
import { Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RedisService } from 'src/redis/redis.service';

@ApiTags('사용자')
@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 내 정보 조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/info')
  async myInfo(@Request() req) {
    const userId = req.user.id;
    const data = await this.userService.findOneById(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '내 정보 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 비밀번호 수정
   * @param changePasswordDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('info')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = req.user.id;
    const data = await this.userService.changePassword(changePasswordDto, userId);
    return {
      statusCode: HttpStatus.OK,
      message: '비밀번호가 수정되었습니다.',
      data,
    };
  }

  /**
   * 이름으로 유저아이디 찾기
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserId(@Query('name') name: string): Promise<object> {
    console.log('name', name);

    const data = await this.userService.findOneByName(name);
    console.log('data컨트롤러', data);

    return {
      statusCode: HttpStatus.OK,
      message: '사용자의 이름으로 아이디 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 회원탈퇴
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('delete')
  async deleteUser(@Request() req) {
    const userId = req.user.id;
    const data = await this.userService.deleteUser(userId);
    await this.redisService.removeRefreshToken(req.user.id); // 리프레시 토큰 삭제
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: '회원탈퇴 되었습니다.',
      data,
    };
  }

  /**
   * 탈퇴유저 살리기
   * @param id
   * @returns
   */
  @Put('cancel')
  async cancelUserDelete(@Body('id') id: number) {
    const data = await this.userService.cancelUserDelete(id);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: '회원탈퇴 취소되었습니다.',
      data,
    };
  }

  /**
   * 유저 이미지 수정
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('upload-img')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImg(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user.id;
    const maxWidth = 150;
    const data = await this.userService.uploadImageToCloudflare(userId, file, maxWidth);

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: '이미지가 변경되었습니다.',
      data,
    };
  }
}
