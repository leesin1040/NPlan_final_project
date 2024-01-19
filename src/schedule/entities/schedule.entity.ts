import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  //Day JoinColumn
  @Column({ type: 'int', nullable: false })
  day_id: number;

  // 주소(도로명 or 지번)
  @Column({ type: 'varchar', nullable: false })
  place: string;

  // 위도
  @Column({ type: 'int', nullable: false })
  latitude: number;

  // 경도
  @Column({ type: 'int', nullable: false })
  longitude: number;

  // 12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점
  @Column({ type: 'int', nullable: false })
  category_id: number;

  // 순서 정렬 값 -> lexorank 사용
  @Column({ type: 'varchar' })
  order: string;

  // 비용
  @Column({ type: 'int', nullable: true })
  cost: number;

  // 체크리스트
  @Column({ type: 'json', nullable: true })
  check_list: JSON;

  // 교통수단
  @Column({ type: 'varchar', nullable: true })
  transportation: string;

  // 메모
  @Column({ type: 'text', nullable: true })
  memo: string;
}
