import {SearchService} from "../elasticsearch/elasticsearch.service";
import {Injectable} from "@nestjs/common";
import LikeEsVo from "./likeEs.vo";

@Injectable()
export class LikeEsRepository {
    constructor(private readonly searchService: SearchService) {}

    async searchLike(body: any): Promise<Array<LikeEsVo>> {
        const result = await this.searchService.search("test-index", body);
        return result.map(hit => {
            console.log(hit)
            const likeEsVO = new LikeEsVo()
            likeEsVO.id = hit.id
            likeEsVO.test = hit.test
            return likeEsVO
        })
    }

}