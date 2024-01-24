import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { sendToHTML } from './utils/file-utils';
import { LoginOrNotGuard } from './auth/guards/optional.guard';

@Controller()
export class AppController {
  @UseGuards(LoginOrNotGuard)
  @Get()
  getMain(@Res() res: Response) {
    return sendToHTML(res, 'index.html');
  }

  //로그인
  @Get('/login')
  getLogin(@Res() res: Response) {
    return sendToHTML(res, 'login.html');
  }

  //회원가입
  @Get('/sign-up')
  getSignUp(@Res() res: Response) {
    return sendToHTML(res, 'signup.html');
  }

  //마이페이지
  @Get('/me')
  getMyPage(@Res() res: Response) {
    return sendToHTML(res, 'info.html');
  }

  //내 여행 일정
  @Get('/my-travel')
  getMyTravel(@Res() res: Response) {
    return sendToHTML(res, 'myTravels.html');
  }

  //트레블 상세보기
  @Get('/travel/:travelId')
  getOneTravel(@Res() res: Response) {
    return sendToHTML(res, 'travelDetail.html');
  }

  //포스트 작성 페이지
  @Get('/post')
  postTravel(@Res() res: Response) {
    return sendToHTML(res, 'post.html');
  }

  //포스트 상세보기 - 삭제 기능
  @Get('/post/:postId')
  getOnePost(@Res() res: Response) {
    return sendToHTML(res, 'PostDetail.html');
  }

  //트레블 수정
  @Get('/update/:postId')
  updateOneTravel(@Res() res: Response) {
    return sendToHTML(res, 'postUpdate.html');
  }
}
