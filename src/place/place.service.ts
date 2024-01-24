import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { DataSource, Like, Repository } from 'typeorm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}
  async getAddress() {
    const getAddress = await this.placeRepository.find({
      order: { id: 'ASC' },
    });
    return getAddress;
  }
  async getMainRegion(region: string) {
    const getMainRegion = await this.placeRepository.find({
      where: {
        address: Like(`${region}%`),
      },
      order: { raiting: 'DESC' },
      take: 10,
    });
    return getMainRegion;
  }
}
