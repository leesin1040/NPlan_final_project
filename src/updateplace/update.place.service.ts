import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Place } from 'src/place/entities/place.entity';
import { UpdatePlace } from './entitiy/update.place.entity';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, throwError } from 'rxjs';
import { cat3Mapping } from 'src/place/utils/category.mapping';

@Injectable()
export class UpdatePlaceService {
  private readonly logger = new Logger(UpdatePlaceService.name);

  constructor(
    @InjectRepository(UpdatePlace, 'travelPlace')
    private readonly updatePlaceRepository: Repository<UpdatePlace>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private dataSource: DataSource,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  // place업데이트
  // 원래 데이터랑 비교 -> 삭제된 place존재하는지 비교
  // 그삭제된 placeId를 schedule에서 null로 표기 후 폐업으로 표시
  // modifiedTime로 수정된거 존재하는지 비교 ex)20240207172652
  // 하루마다 업데이트니 8개만 잘라서 비교
  // 가져온데이터들 중 modifiedTime이 오늘인 데이터만 filter
  // 원래있던 데이터들 중 업데이트

  // @Cron(CronExpression.EVERY_5_SECONDS)
  async uploadPlaces() {
    // const databaseName = this.configService.get<string>('DB_NAME');
    const queryRunner = this.dataSource.createQueryRunner();
    const key = this.configService.get<string>('UPDATE_KEY');
    const contentTypeIdList = [32, 38, 12, 39];
    try {
      //     // 12:관광지, 32:숙박, 38:쇼핑, 39:음식점
      await queryRunner.connect();
      await queryRunner.startTransaction();

      for (const contentTypeId of contentTypeIdList) {
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
              contentTypeId: contentTypeId,
              _type: 'json',
            },
          },
        );
        // response.data.response.body.items 요기에 여행지정보 배열
        // response.data.response.body의 totalCount존재 체크후 ->numOfRows
        if (checkResponse.data.response.body.totalCount !== 0) {
          count = checkResponse.data.response.body.totalCount;
          const response = await this.httpService.axiosRef.get(
            `http://apis.data.go.kr/B551011/KorService1/areaBasedSyncList1`,
            {
              params: {
                serviceKey: key,
                pageNo: 1,
                numOfRows: 10,
                MobileApp: 'AppTest',
                MobileOS: 'ETC',
                arrange: 'A',
                contentTypeId: contentTypeId,
                _type: 'json',
              },
            },
          );
          const apiData = response.data.response.body.items.item;
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
            category: cat3Mapping(place.cat3),
          }));
          for (const place of transformedData) {
            try {
              if (
                place.cat1 === 'A01' ||
                place.cat1 === 'A02' ||
                place.cat1 === 'A04' ||
                place.cat1 === 'A05' ||
                place.cat1 === 'B02'
              ) {
                await this.updatePlaceRepository.insert(place);
              }
            } catch (error) {}
          }
          await queryRunner.commitTransaction();
          console.log('끝');
        } else {
          console.log('요청에 실패했습니다');
        }
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`여행지 정보 업로드 중 오류 발생: ${error.message}`);
    }
  }
}
