import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './elasticsearch.service';

@Controller('api/es')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  //최종 경로 http://localhost:3000/api/es/search?title=경주
  //article을 기준으로 검색
  @Get('/search')
  async search(@Query('word') word: string) {
    const searchByTitle = await this.searchService.searchByTitle('articles', word);
    const searchByContent = await this.searchService.searchByContent('articles', word);
    return { searchByTitle, searchByContent };
  }

  //최종 경로 http://localhost:3000/api/es/place?name=경주
  //place 이름 기준으로 검색
  @Get('/place')
  async searchPlace(@Query('word') name: string) {
    const searchByPlace = await this.searchService.searchByPlace('places', name);
    return { searchByPlace };
  }

  // @Get('/articles')
  // async indexingArticle() {
  //   await this.searchService.indexAllArticle();
  // }

  @Get('/places')
  async indexingPlace() {
    await this.searchService.indexAllPlaces();
  }
}
