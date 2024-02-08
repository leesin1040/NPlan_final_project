import {Module} from "@nestjs/common";
import {ElasticsearchModule, ElasticsearchService} from "@nestjs/elasticsearch";
import {SearchService} from "./elasticsearch.service";
import {ElasticsearchController} from "./elasticsearch.controller";

@Module({
    imports: [ElasticsearchModule.register({
        node: 'http://localhost:9200',
    })],
    providers: [SearchService],
    controllers: [ElasticsearchController],
    exports: [SearchService],
})
export class SearchModule {}