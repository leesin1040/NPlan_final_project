import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './elasticsearch.service';

@Controller('api/es')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  //최종 경로 http://localhost:3000/api/es/search?title=경주
  //article을 타이틀 기준으로 검색
  @Get('search')
  async search(@Query('title') title: string) {
    const query = {
      query: {
        match: {
          title: {
            query: title,
            fuzziness: 1,
          },
        },
      },
    };
    return await this.searchService.searchTitle('articles', query);
  }

  @Get('/article')
  async indexingArticle() {
    try {
      await this.searchService.indexAllArticle();
      console.log('article 인덱싱 초기화');
      return { message: 'article 인덱싱이 성공적으로 완료되었습니다.' };
    } catch (error) {
      console.error('article 인덱싱 중 에러 발생:', error);
      return { message: 'article 인덱싱 중 에러가 발생했습니다.', error: error.message };
    }
  }
}
