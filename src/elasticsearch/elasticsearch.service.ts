import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from 'src/place/entities/place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  private esClient: Client;

  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly configService: ConfigService,
  ) {
    this.esClient = new Client({
      node: this.configService.get<string>('ELASTICSEARCH_NODE'),
    });
  }

  async search(index: string, query: any) {
    const result = await this.esClient.search({
      index,
      body: query,
    });
    return result;
  }

  async indexData(indexName: string, data: any) {
    return await this.esClient.index({
      index: indexName,
      body: data,
    });
  }

  async createIndex(indexName: string) {
    const { body: indexExists } = await this.esClient.indices.exists({ index: indexName });
    if (!indexExists) {
      await this.esClient.indices.create({ index: indexName });
    }
  }

  async indexAllPlace() {
    const places = await this.placeRepository.find();
    const indexPromises = places.map((place) => {
      const placeToIndex = {
        id: place.id,
        name: place.name,
        address: place.address,
      };
      return this.indexData('places', placeToIndex);
    });
    return Promise.all(indexPromises);
  }
}
