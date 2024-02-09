import { Controller, Get, Request } from '@nestjs/common';
import { SearchService } from './elasticsearch.service';

@Controller('/api/es')
export class ElasticsearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('')
  async search() {
    console.log('하이');

    // const query = {
    //   query: {
    //     term: {
    //       id: '2',
    //     },
    //   },
    // };
    // const result = await this.searchService.search('test-index', query);
    // return result;
  }

  @Get('/place')
  async indexing() {
    const result = await this.searchService.indexAllPlace();
    console.log('인덱싱중');
    return { message: '인덱싱함' };
  }
}
