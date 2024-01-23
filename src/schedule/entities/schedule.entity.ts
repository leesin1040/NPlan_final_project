import { Day } from 'src/day/entities/day.entity';
import { Place } from 'src/place/entities/place.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'schedule' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  //Day 1:N Schedule
  @ManyToOne(() => Day, (day) => day.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'day_id' })
  day: Day;
  @Column({ type: 'int', nullable: false })
  dayId: number;

  //Place 1: N Schedule
  @ManyToOne(() => Place, (place) => place.schedule)
  @JoinColumn({ name: 'place_id' })
  place: Place;
  @Column({ type: 'int', nullable: false })
  placeId: number;

  // title
  // @Column({ type: 'varchar', nullable: false })
  // title: string;

  // // 주소(도로명 or 지번)
  // @Column({ type: 'varchar', nullable: false })
  // place: string;

  // // 위도
  // @Column({ name: 'map_y', type: 'int', nullable: false })
  // mapY: number;

  // // 경도
  // @Column({ name: 'map_x', type: 'int', nullable: false })
  // mapX: number;

  // // A01 자연, A02 인문(문화/예술/역사), A03 레포츠, A04 쇼핑, A05 음식, B02 숙박, C01 추천코스
  // @Column({ type: 'varchar', nullable: false })
  // category: string;

  // 순서 정렬 값 -> lexorank 사용
  @Column({ type: 'varchar' })
  order: string;

  // 교통수단
  @Column({ type: 'varchar', nullable: true })
  transportation: string;

  // 메모
  @Column({ type: 'text', nullable: true })
  memo: string;
}
