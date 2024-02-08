import {Controller, Get, Param, Req} from '@nestjs/common';
import {SearchService} from "./elasticsearch.service";

@Controller('api/es')
export class ElasticsearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('/')
    async search() {
        const query = {
            "query": {
                "term": {
                    "id": "2",
                }
            }
        }


        // const result = await this.searchService.search('test-index', query);
        return ""
    }
}
