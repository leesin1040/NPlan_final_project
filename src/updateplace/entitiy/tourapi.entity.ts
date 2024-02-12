import { Schedule } from 'src/schedule/entities/schedule.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('tour_api_place')
export class TourApiPlace {
  @PrimaryGeneratedColumn()
  id: number;

  // 장소 이름 ex. 서울역
  @Column({ nullable: true })
  title: string;

  // 지역코드 ex. 1 (서울)
  @Column({ nullable: true, type: 'int' })
  areaCode: number;

  // 시군구코드 ex. 1 (강남구)(지역코드에 따라 시군구 코드 달라짐)
  @Column({ nullable: true, type: 'int' })
  sigunguCode: number;

  // 주소 ex. 서울특별시 중구 소공동 세종대로18길 2
  @Column({ type: 'varchar', nullable: true })
  address: string;

  // 경도 ex. 126.972317
  @Column({ name: 'map_x', type: 'varchar', nullable: true })
  mapX: string;

  // 위도 ex. 37.555946
  @Column({ name: 'map_y', type: 'varchar', nullable: true })
  mapY: string;

  // 검색수(추후 변경 가능성 있음) ex. 214235
  @Column({ nullable: true })
  rank: number;

  // 대분류코드 ex. A02 인문
  @Column({ name: 'cat1', nullable: true })
  cat1: string;

  // 중분류코드 ex. A0205 건축/조형물
  @Column({ name: 'cat2', nullable: true })
  cat2: string;

  // 소분류코드
  @Column({ name: 'cat3', nullable: true })
  cat3: string;

  // 장소 이미지 ex. http://~~.jpg
  @Column({ name: 'first_image', nullable: true, default: null })
  firstImage: string;

  @Column({ name: 'content_id', type: 'int', nullable: true })
  contentId: number;

  //   관광지,숙박 등등
  @Column({ name: 'content_type_id', type: 'int', nullable: true })
  contentTypeId: number;

  //   등록일
  @Column({ name: 'createdTime', type: 'int', nullable: true })
  createdTime: number;

  //   수정일
  @Column({ name: 'modifiedTime', type: 'int', nullable: true })
  modifiedTime: number;

  @Column({ name: 'place_point', type: 'point', nullable: true })
  placePoint: string;
}
// http://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=인증키&pageNo=1&numOfRows=10&MobileApp=AppTest&MobileOS=ETC&arrange=A&contentTypeId=32
