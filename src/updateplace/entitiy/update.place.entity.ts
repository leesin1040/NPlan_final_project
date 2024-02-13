import { Schedule } from 'src/schedule/entities/schedule.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('place')
export class UpdatePlace {
  @PrimaryGeneratedColumn()
  id: number;

  // 장소 이름 ex. 서울역
  @Column({ nullable: true })
  name: string;

  // 지역코드 ex. 1 (서울)
  @Column({ nullable: true })
  areaCode: string;

  // 시군구코드 ex. 1 (강남구)(지역코드에 따라 시군구 코드 달라짐)
  @Column({ nullable: true })
  sigunguCode: string;

  // 주소 ex. 서울특별시 중구 소공동 세종대로18길 2
  @Column({ nullable: true })
  address: string;

  // 경도 ex. 126.972317
  @Column({ name: 'map_x', type: 'double', nullable: true })
  mapX: number;

  // 위도 ex. 37.555946
  @Column({ name: 'map_y', type: 'double', nullable: true })
  mapY: number;

  // 검색수(추후 변경 가능성 있음) ex. 214235
  @Column({ nullable: true })
  rank: number;

  // 카테고리 ex. 관광지
  @Column({ name: 'category', nullable: true })
  category: string;

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
  @Column({ name: 'img_url', nullable: true, default: null })
  imgUrl: string;

  @Column({ name: 'place_point', type: 'point', nullable: true })
  placePoint: string;

  // 관광지 고유 Id
  @Column({ name: 'place_id', type: 'int', nullable: true })
  placeId: number;

  //   등록일
  @Column({ name: 'createdTime', type: 'int', nullable: true })
  createdTime: number;

  //   수정일
  @Column({ name: 'modifiedTime', type: 'int', nullable: true })
  modifiedTime: number;

  //  관광지,숙박 등등
  @Column({ name: 'content_type_id', type: 'int', nullable: true })
  contentTypeId: number;
}
// http://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=인증키&pageNo=1&numOfRows=10&MobileApp=AppTest&MobileOS=ETC&arrange=A&contentTypeId=32
