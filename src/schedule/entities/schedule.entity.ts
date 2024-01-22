import { Day } from 'src/day/entities/day.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'schedule' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  //Day JoinColumn
  @Column({ name: 'day_id', type: 'int', nullable: false })
  dayId: number;

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
  contentId: number;

  // 순서 정렬 값 -> lexorank 사용
  @Column({ type: 'varchar' })
  order: string;

  // 교통수단
  @Column({ type: 'varchar', nullable: true })
  transportation: string;

  // 메모
  @Column({ type: 'text', nullable: true })
  memo: string;

  //Day 1:N Schedule
  @ManyToOne(() => Day, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'day_id' })
  day: Day;
}
