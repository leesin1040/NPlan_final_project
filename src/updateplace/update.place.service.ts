import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Place } from 'src/place/entities/place.entity';
import { UpdatePlace } from './entitiy/update.place.entity';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, throwError } from 'rxjs';
import { TourApiPlace } from './entitiy/tourapi.entity';

@Injectable()
export class UpdatePlaceService {
  private readonly logger = new Logger(UpdatePlaceService.name);

  constructor(
    @InjectRepository(UpdatePlace, 'travelPlace')
    private readonly updatePlaceRepository: Repository<UpdatePlace>,
    @InjectRepository(TourApiPlace, 'travelPlace')
    private readonly tourApiPlaceRepository: Repository<TourApiPlace>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private dataSource: DataSource,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async uploadPlaces() {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const key = this.configService.get<string>('UPDATE_KEY');

      let count = 1;
      const checkResponse = await this.httpService.axiosRef.get(
        `http://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`,
        {
          params: {
            serviceKey: key,
            pageNo: 1,
            numOfRows: count,
            MobileApp: 'AppTest',
            MobileOS: 'ETC',
            arrange: 'A',
            contentTypeId: 39,
            _type: 'json',
          },
        },
      );
      // response.data.response.body.items 요기에 여행지정보 배열
      // response.data.response.body의 totalCount존재 체크후 ->numOfRows
      // 12:관광지, 32:숙박, 38:쇼핑, 39:음식점

      if (checkResponse.data.response.body.totalCount !== 0) {
        count = checkResponse.data.response.body.totalCount;

        const response = await this.httpService.axiosRef.get(
          `http://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`,
          {
            params: {
              serviceKey: key,
              pageNo: 1,
              numOfRows: count,
              MobileApp: 'AppTest',
              MobileOS: 'ETC',
              arrange: 'A',
              contentTypeId: 28,
              _type: 'json',
            },
          },
        );

        const apiData = response.data.response.body.items.item;

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const transformedData = apiData.map((place) => ({
          title: place.title || null,
          areaCode: parseInt(place.areacode) || null,
          sigunguCode: parseInt(place.sigungucode) || null,
          address: place.addr1
            ? place.addr2
              ? `${place.addr1} ${place.addr2}`
              : place.addr1
            : null,
          mapX: isNaN(place.mapx) ? null : place.mapx,
          mapY: isNaN(place.mapy) ? null : place.mapy,
          cat1: place.cat1 || null,
          cat2: place.cat2 || null,
          cat3: place.cat3 || null,
          firstImage: place.firstimage || null,
          contentId: parseInt(place.contentid) || null,
          contentTypeId: parseInt(place.contenttypeid) || null,
          createdTime: parseInt(place.createdtime) || null,
          modifiedTime: parseInt(place.modifiedtime) || null,
          placePoint: place.mapx && place.mapy ? `POINT(${place.mapx} ${place.mapy})` : null,
        }));

        await queryRunner.commitTransaction();
        for (const place of transformedData) {
          try {
            if (
              place.cat1 === 'A01' ||
              place.cat1 === 'A02' ||
              place.cat1 === 'A04' ||
              place.cat1 === 'A05' ||
              place.cat1 === 'B02'
            ) {
              await this.tourApiPlaceRepository.insert(place);
            }
          } catch (error) {
            await queryRunner.rollbackTransaction();
            return;
          }
        }
      } else {
        console.log('요청에 실패했습니다');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`여행지 정보 업로드 중 오류 발생: ${error.message}`);
    }
  }
}
