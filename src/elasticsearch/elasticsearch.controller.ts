import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './elasticsearch.service';

@Controller('api/es')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  //최종 경로 http://localhost:3000/api/es/search?title=경주
  //article을 타이틀 기준으로 검색
  @Get('search')
  async search(@Query('word') word: string) {
    const searchByTitle = await this.searchService.searchByTitle('articles', word);
    const searchByContent = await this.searchService.searchByContent('articles', word);
    return { searchByTitle, searchByContent };
  }

  @Get('/articles')
  async indexingArticle() {
    try {
      // await this.searchService.indexAllArticle();
      const count = await this.searchService.countDocuments('articles');
      console.log(count);
      console.log(`article 인덱싱 초기화, 총 문서 개수: ${count}`);
      return { message: `article 인덱싱이 성공적으로 완료되었습니다. 총 문서 개수: ${count}` };
    } catch (error) {
      console.error('article 인덱싱 중 에러 발생:', error);
      return { message: 'article 인덱싱 중 에러가 발생했습니다.', error: error.message };
    }
  }

  @Get('/places')
  async indexingPlace() {
    // places 인덱싱 시작
    await this.searchService.indexAllPlaces();
  }
}
