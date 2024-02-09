import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './elasticsearch.service';

@Controller('api/es')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  //최종 경로 http://localhost:3000/api/es/search?title=경주
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
    return await this.searchService.search('articles', query);
  }

  @Get('/article')
  async indexing() {
    try {
      await this.searchService.indexAllArticle();
      console.log('인덱싱 완료');
      return { message: '인덱싱이 성공적으로 완료되었습니다.' };
    } catch (error) {
      console.error('인덱싱 중 에러 발생:', error);
      return { message: '인덱싱 중 에러가 발생했습니다.', error: error.message };
    }
  }
}
