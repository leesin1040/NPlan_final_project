import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { sendToHTML } from './utils/file-utils';
import { LoginOrNotGuard } from './auth/guards/optional.guard';
import { TravelService } from './travel/travel.service';
import { UserService } from './user/user.service';
import { ScheduleService } from './schedule/schedule.service';
import { PlaceService } from './place/place.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { MemberService } from './member/member.service';
import { LikeService } from './like/like.service';
import { DayService } from './day/day.service';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
    private readonly memberService: MemberService,
    private readonly travelService: TravelService,
    private readonly dayService: DayService,
    private readonly scheduleService: ScheduleService,
    private readonly placeService: PlaceService,
    private readonly likeService: LikeService,
    private readonly commentService: CommentService,
  ) {}

  @UseGuards(LoginOrNotGuard)
  @Get('main')
  getMain(@Res() res: Response) {
    return sendToHTML(res, 'index.html');
  }

  //회원가입
  @Get('sign-up')
  getSignUp(@Res() res: Response) {
    return sendToHTML(res, 'signup.html');
  }

  //마이페이지
  @Get('me')
  getMyPage(@Res() res: Response) {
    return sendToHTML(res, 'info.html');
  }

  //내 여행 일정
  @Get('my-travel')
  getMyTravel(@Res() res: Response) {
    return sendToHTML(res, 'myTravels.html');
  }

  //트레블 상세보기
  @Get('travel/:travelId')
  getOneTravel(@Res() res: Response) {
    return sendToHTML(res, 'travelDetail.html');
  }

  //포스트 작성 페이지
  @Get('/post')
  postTravel(@Res() res: Response) {
    return sendToHTML(res, 'post.html');
  }

  //포스트 상세보기 - 삭제 기능
  @Get('post/:postId')
  getOnePost(@Res() res: Response) {
    return sendToHTML(res, 'PostDetail.html');
  }

  //트레블 수정
  @Get('update/:postId')
  updateOneTravel(@Res() res: Response) {
    return sendToHTML(res, 'postUpdate.html');
  }
}
