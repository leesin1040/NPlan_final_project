import { AppService } from './app.service';
import { Body, Controller, Get, Param, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
import { LoginOrNotGuard } from './auth/guards/optional.guard';
import { TravelService } from './travel/travel.service';
import { UserService } from './user/user.service';
import { ScheduleService } from './schedule/schedule.service';
import { PlaceService } from './place/place.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { MemberService } from './member/member.service';
import { DayService } from './day/day.service';
import { CommentService } from './comment/comment.service';
import { User } from './user/entities/user.entity';
import { ArticleService } from './article/article.service';
import { LikeService } from './like/articlelike.service';
import { SearchService } from './elasticsearch/elasticsearch.service';
import { UserInfo } from './common/decorators/userInfo.decorator';
import { Page } from './common/decorators/page.decorator';

@Controller()
export class AppController {
  constructor(
    private configService: ConfigService,
    private readonly appService: AppService,
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly memberService: MemberService,
    private readonly travelService: TravelService,
    private readonly dayService: DayService,
    private readonly scheduleService: ScheduleService,
    private readonly placeService: PlaceService,
    private readonly likeService: LikeService,
    private readonly commentService: CommentService,
    private readonly searchService: SearchService,
  ) {}

  // 메인페이지
  @UseGuards(LoginOrNotGuard)
  @Get()
  @Page('main')
  async hello(@UserInfo() user: User) {
    const data = await this.articleService.getByLikeArticles();
    const pageTitle = '홈';
    return {
      user,
      pageTitle,
      data,
    };
  }

  //회원가입
  @UseGuards(LoginOrNotGuard)
  @Get('sign-up')
  @Page('signup')
  async getSignUp(@UserInfo() user: User) {
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

  //내 article 조회
  @UseGuards(LoginOrNotGuard)
  @Get('/my-articles')
  @Page('articleList')
  async getMyArticles(@UserInfo() user: User) {
    const userId = user.id;
    const data = await this.articleService.getArticlesByUser(userId);
    const pageTitle = '내 후기 목록';
    return { user, data, pageTitle };
  }

  //article 전체 조회
  @UseGuards(LoginOrNotGuard)
  @Get('/articles')
  @Page('articleList')
  async getArticles(@UserInfo() user: User) {
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
  @Get('/article/:articleId')
  async getOnePost(@UserInfo() user: User, @Param('articleId') articleId: number) {
    const pageTitle = '상세보기';
    const article = await this.articleService.getArticleById(articleId);
    const data = await this.commentService.getAllComment(articleId);
    if (user !== null) {
      const userId = user.id;
      const isLikedArticle = await this.likeService.likeByArticle(userId, articleId);
      return { user, pageTitle, article, data, isLikedArticle };
    }
    return { user, pageTitle, article, data, isLikedArticle: false };
  }

  //포스트 수정
  @UseGuards(LoginOrNotGuard)
  @Page('updateArticle')
  @Get('/update/:articleId')
  async updateOneTravel(@UserInfo() user: User, @Param('articleId') articleId: number) {
    const article = await this.articleService.getArticleById(articleId);
    const pageTitle = '포스트 수정';
    return { user, pageTitle, article };
  }
  // 검색
  @UseGuards(LoginOrNotGuard)
  @Page('search')
  @Get('/search')
  async search(@UserInfo() user: User, @Query('word') word: string) {
    const pageTitle = `검색:${word}`;
    const searchByTitle = await this.searchService.searchByTitle('articles', word);
    const searchByContent = await this.searchService.searchByContent('articles', word);
    const searchedWord = word;
    return { user, pageTitle, searchByTitle, searchByContent, searchedWord };
  }

  @Get('/error-page')
  @Page('error')
  getErrorPage(@Query('errorUrl') errorUrl: string) {
    const pageTitle = '에러 페이지';
    if (errorUrl === '/favicon.ico') {
      return { pageTitle, errorUrl: '' };
    }
    return { pageTitle, errorUrl: decodeURIComponent(errorUrl) };
  }

  @Post('/api/err-msg')
  async sendErrToTeam(@Body() body: { message: string }) {
    const { message } = body;
    const data = await this.appService.sendNotification(message);
    return { data };
  }
}
