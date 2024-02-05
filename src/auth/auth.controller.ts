import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dtos/login.dto';
import { Response } from 'express';

@ApiTags('인증')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   * @param registerDto
   * @returns
   */
  @Post('/register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const data = await this.authService.register(registerDto);
    res.cookie('Authorization', data.accessToken);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '회원가입 완료!',
      data,
    });
  }
  /**
   * 로그인
   * @param req
   * @param loginDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req, @Body() loginDto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(req.user.id);
    res.cookie('Authorization', data.accessToken);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '로그인 성공',
      data,
    });
  }

  /**
   * Access 토큰 갱신
   * @param req
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Request() req) {
    const data = await this.authService.refresh(req.body.refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: '토큰이 성공적으로 갱신되었습니다.',
      data,
    };
  }
}
