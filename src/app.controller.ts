import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LoginOrNotGuard } from './auth/guards/optional.guard';
import { TravelService } from './travel/travel.service';
import { UserService } from './user/user.service';
import { ScheduleService } from './schedule/schedule.service';
import { PlaceService } from './place/place.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { MemberService } from './member/member.service';
import { LikeService } from './like/like.service';
import { DayService } from './day/day.service';
import { CommentService } from './comment/comment.service';
import { Page } from './decorators/page.decorator';
import { UserInfo } from './decorators/userInfo.decorator';
import { User } from './user/entities/user.entity';
import { ArticleService } from './article/article.service';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService,
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly memberService: MemberService,
    private readonly travelService: TravelService,
    private readonly dayService: DayService,
    private readonly scheduleService: ScheduleService,
    private readonly placeService: PlaceService,
    private readonly likeService: LikeService,
    private readonly commentService: CommentService,
  ) {}

  // 메인페이지
  @UseGuards(LoginOrNotGuard)
  @Get()
  @Page('main')
  async hello(@UserInfo() user: User) {
    const pageTitle = '홈';
    return {
      user,
      pageTitle,
    };
  }

  //회원가입
  @UseGuards(LoginOrNotGuard)
  @Get('sign-up')
  @Page('signup')
  getSignUp(@UserInfo() user: User) {
    const pageTitle = '회원가입';
    return {
      user,
      pageTitle,
    };
  }

  //마이페이지
  @UseGuards(LoginOrNotGuard)
  @Get('userinfo')
  @Page('userinfo')
  getMyPage(@UserInfo() user: User) {
    const pageTitle = '마이페이지';
    console.log(user);
    return {
      user,
      pageTitle,
    };
  }

  //내 여행 일정
  @UseGuards(LoginOrNotGuard)
  @Get('my-travel')
  @Page('myTravels')
  async getMyTravel(@UserInfo() user: User) {
    const pageTitle = '내 여행 보드';
    const userId = user.id;
    const data = await this.travelService.findAll(userId);
    return { user, myTravels: data.myTravels, invitedTravels: data.invitedTravels, pageTitle };
  }

  //트레블 상세보기
  @UseGuards(LoginOrNotGuard)
  @Get('travel/:travelId')
  @Page('travelDetail')
  async getOneTravel(@UserInfo() user: User, @Param('travelId') travelId: number) {
    const userId = user.id;
    const { oneTravel } = await this.travelService.findOneTravel(travelId, userId);
    const days = await this.dayService.getDays(travelId);
    //day에 따른 스케쥴 불러오기
    const schedulesPromises = days.map(async (day) => {
      const dayId = day.id;
      const schedules = await this.scheduleService.findAllByDayId(dayId);
      return { dayId, schedules };
    });
    const schedulesResults = await Promise.all(schedulesPromises);
    const pageTitle = oneTravel.title;
    return {
      user,
      oneTravel: oneTravel,
      days,
      schedulesResults: schedulesResults,
      pageTitle,
    };
  }

  //article 전체 조회 - 완
  @UseGuards(LoginOrNotGuard)
  @Get('/articles')
  @Page('articleList')
  async getArticles(@UserInfo() user: User, @Res() res: Response) {
    const data = await this.articleService.getAllArticles();
    const pageTitle = '후기 게시판';
    return { user, data, pageTitle };
  }

  //포스트 작성 페이지 - 완
  @UseGuards(LoginOrNotGuard)
  @Get('/post')
  @Page('postArticle')
  postTravel(@UserInfo() user: User) {
    const pageTitle = '글쓰기';
    return { user, pageTitle };
  }

  //포스트 상세보기
  @UseGuards(LoginOrNotGuard)
  @Page('oneArticle')
  @Get('article/:articleId')
  async getOnePost(@UserInfo() user: User, @Param('articleId') articleId: number) {
    const article = await this.articleService.getArticleById(articleId);
    const pageTitle = '상세보기';
    return { user, pageTitle, article };
  }

  //포스트 수정
  @UseGuards(LoginOrNotGuard)
  @Page('updateArticle')
  @Get('update/:articleId')
  async updateOneTravel(@UserInfo() user: User, @Param('articleId') articleId: number) {
    const article = await this.articleService.getArticleById(articleId);
    const pageTitle = '포스트 수정';
    return { user, pageTitle, article };
  }
}
