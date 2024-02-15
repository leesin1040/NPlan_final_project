import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { Place } from 'src/place/entities/place.entity';
import cheerio from 'cheerio';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly esService: ElasticsearchService,
  ) {}

  // 제목으로 검색
  async searchByTitle(index: string, searchText: string) {
    const query = {
      query: {
        match: {
          title: {
            query: searchText,
            fuzziness: 1,
          },
        },
      },
    };
    const hits = await this.esService.search({
      index,
      body: query,
    });
    const result = hits.body.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));
    return result;
  }

  // 내용으로 검색
  async searchByContent(index: string, searchText: string) {
    const query = {
      query: {
        match: {
          content: searchText,
        },
      },
    };
    const hits = await this.esService.search({
      index,
      body: query,
    });
    const result = hits.body.hits.hits.map((hit) => ({
      id: hit._id,
      content: hit._source.content.substring(0, 100),
      ...hit._source,
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
  // async createIndex(indexName: string) {
  //   const indexExists = await this.esService.indices.exists({ index: indexName });
  //   if (!indexExists) {
  //     await this.esService.indices.create({ index: indexName });
  //   }
  // }
  // 인덱스(테이블)을 생성하는 함수 수정
  async createIndex(indexName: string) {
    const indexExists = await this.esService.indices.exists({ index: indexName });
    let response;
    if (!indexExists.body) {
      // exists 메서드의 응답에서 body 속성 확인
      response = await this.esService.indices.create({ index: indexName });
    }
    return response; // 인덱스 생성 응답 반환
  }

  //인덱스(테이블)를 삭제
  async deleteIndex(indexName: string) {
    const indexExists = await this.esService.indices.exists({ index: indexName });
    if (indexExists) {
      await this.esService.indices.delete({ index: indexName });
    }
  }

  async indexAllArticle() {
    const indexName = 'articles';
    await this.deleteIndex(indexName);
    await this.createIndex(indexName);
    // 관계된 'user' 데이터를 포함하여 모든 기사를 조회
    const articles = await this.articleRepository.find({ relations: ['user'] });
    const indexPromises = articles.map((article) => {
      const $ = cheerio.load(article.editorContent);
      const textContent = $('body').text() || $('html').text() || $.root().text();
      const articleToIndex = {
        id: article.id,
        title: article.articleTitle,
        writer: article.user.name,
        content: textContent.trim(),
      };
      return this.indexData(indexName, articleToIndex);
    });
    return Promise.all(indexPromises);
  }

  async indexAllPlaces() {
    const startTime = new Date(); // 시작 시간 기록
    console.log(`Indexing 시작 시간: ${startTime}`);
    const indexName = 'places';
    await this.deleteIndex(indexName);
    await this.createIndex(indexName); // 인덱스가 없으면 생성
    const batchSize = 10000; // 한 번에 처리할 배치 크기
    let offset = 0;
    let places;
    do {
      places = await this.placeRepository.find({
        select: ['id', 'name'],
        take: batchSize,
        skip: offset,
      });
      // 벌크 인덱싱을 위한 요청 바디 생성
      const body = places.flatMap((doc) => [
        { index: { _index: indexName, _id: doc.id.toString() } },
        doc,
      ]);
      // 벌크 인덱싱 실행
      if (body.length > 0) {
        await this.esService.bulk({ refresh: true, body });
      }
      offset += batchSize;
    } while (places.length === batchSize); // 모든 데이터가 처리될 때까지 반복
    const endTime = new Date(); // 끝난 시간 기록
    console.log(`Indexing 시작 시간: ${startTime}`);
    console.log(`Indexing 끝난 시간: ${endTime}`);
    // 시간 차이 계산 (밀리초)
    const timeGap = endTime.getTime() - startTime.getTime();
    console.log(`Indexing 소요 시간: ${timeGap / 1000}초`);
    console.log('인덱싱 끝!');
  }

  // 인덱싱 개수 확인
  async countDocuments(indexName: string) {
    const response = await this.esService.count({
      index: indexName,
    });
    return response.body.count;
  }
  // 인덱싱 빠르게 하기 위한 place용 세팅
  async createIndexPlace(indexName: string) {
    const { body: indexExists } = await this.esService.indices.exists({ index: indexName });
    if (!indexExists) {
      await this.esService.indices.create({
        index: indexName,
        body: {
          settings: {
            index: {
              number_of_shards: '1', // 샤드의 수를 1로 설정
              number_of_replicas: '0', // 복제본의 수를 0으로 설정
            },
          },
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: { type: 'text' },
            },
          },
        },
      });
    }
  }
}
