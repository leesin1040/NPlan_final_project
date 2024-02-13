import { query } from 'express';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { data } from 'cheerio/lib/api/attributes';
import { Place } from 'src/place/entities/place.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly esService: ElasticsearchService,
  ) {}

  async searchTitle(index: string, query: any) {
    const hits = await this.esService.search({
      index,
      body: query,
    });
    const result = hits.body.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source, // 여기서 writer 포함 확인
    }));
    return result;
  }

  //데이터의 id를 통해 es유니크 아이디 확인
  async searchById(indexName: string, docId: string) {
    const searchResponse = await this.esService.search({
      index: indexName,
      body: {
        query: {
          match: {
            id: docId,
          },
        },
      },
    });
    if (searchResponse.body.hits.total.value === 0) {
      throw new Error('해당 Id를 가진 데이터가 없습니다.');
    }
    const esUniqueId = searchResponse.body.hits.hits[0]._id;
    return esUniqueId;
  }

  // 데이터를 인덱스(엘라스틱서치 형태로 주입)
  async indexData(indexName: string, data: any) {
    return await this.esService.index({
      index: indexName,
      body: data,
    });
  }
  //데이터 수정시
  async updateData(indexName: string, id: string, data: any) {
    const updateDataId = await this.searchById(indexName, id);
    await this.esService.update({
      index: indexName,
      id: updateDataId,
      body: {
        doc: data,
      },
    });
  }
  // 데이터를 인덱스에서 삭제
  async deleteData(indexName: string, id: string) {
    const deleteDataId = await this.searchById(indexName, id);
    await this.esService.delete({
      index: indexName,
      id: deleteDataId,
    });
  }

  /**아래는 초기 세팅시 테이블(인덱스)기준 세팅 */
  // 인덱스(테이블)을 생성
  async createIndex(indexName: string) {
    const indexExists = await this.esService.indices.exists({ index: indexName });
    if (!indexExists) {
      await this.esService.indices.create({ index: indexName });
    }
  }
  //인덱스(테이블)를 삭제
  async deleteIndex(indexName: string) {
    const indexExists = await this.esService.indices.exists({ index: indexName });
    if (indexExists) {
      await this.esService.indices.delete({ index: indexName });
    }
  }
  //기존에 있는 인덱스(테이블)를 삭제하고 새로 생성한 뒤 데이터를 넣는다.
  async indexAllArticle() {
    const indexName = 'articles';
    await this.deleteIndex(indexName);
    await this.createIndex(indexName);
    const articles = await this.articleRepository.find({ relations: ['user'] });
    const indexPromises = articles.map((article) => {
      const articleToIndex = {
        id: article.id,
        title: article.articleTitle,
        writer: article.user.name,
      };
      return this.indexData(indexName, articleToIndex);
    });
    return Promise.all(indexPromises);
  }
}
