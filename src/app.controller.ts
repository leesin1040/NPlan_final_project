import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

@Controller()
export class AppController {
  // @Get('/main')
  // getMain(@Res() res: Response) {
  //   return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  // }

  //로그인
  @Get('/login')
  getLogin(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
  }

  //회원가입
  @Get('/sign-up')
  getSignUp(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
  }

  //마이페이지
  @Get('/me')
  getMyPage(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'info.html'));
  }

  //내 여행 일정
  @Get('/my-travel')
  getMyTravel(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'myTravels.html'));
  }

  //트레블 상세보기
  @Get('/travel/:travelId')
  getOneTravel(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'oneTravel.html'));
  }

  //포스트 작성 페이지
  @Get('/post')
  postTravel(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'post.html'));
  }

  //포스트 상세보기 - 삭제 기능
  @Get('/post/:postId')
  getOnePost(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'onePost.html'));
  }

  //트레블 수정
  @Get('/update/:postId')
  updateOneTravel(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'postUpdate.html'));
  }
}
