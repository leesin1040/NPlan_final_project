import {Injectable} from "@nestjs/common";
import {ElasticsearchService} from "@nestjs/elasticsearch";
import LikeEsVo from "../like/likeEs.vo";
import Any = jasmine.Any;

@Injectable()
export class SearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    async search(index: string, body: any): Promise<Array<any>> {
        const result = await this.elasticsearchService.search({index, body});
        return result["body"]["hits"]["hits"].map(hit => hit._source)
    }



    async searchOne(index: string, body: any) {
        const result = await this.elasticsearchService.search({index, body});
        return result["body"]["hits"]["hits"][0]._source
    }

}