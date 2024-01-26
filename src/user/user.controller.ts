import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dtos/changepassword.dto';
import { Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('사용자')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
      message: '내 정보 조회에 성공했습니다.(이름으로)',
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
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: '회원삭제되었습니다.',
      data,
    };
  }

  // /**
  //  * 유저 이미지 수정
  //  */
  // @ApiOperation({ summary: '이미지 업로드' })
  // @UseInterceptors(FilesInterceptor('file'))
  // @UseGuards(AuthGuard('jwt'))
  // @Post('upload')
  // uploadImg(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  //   return files;
  // }
}
