import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('place')
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  // 장소 이름
  @Column({ nullable: true })
  name: string;

  // 해당 장소를 참조하는 스케줄과 연결
  @OneToMany(() => Schedule, (schedule) => schedule.place)
  schedule: Schedule[];

  // 지역코드
  @Column({ nullable: true })
  areaCode: string;

  // 시군구코드
  @Column({ nullable: true })
  sigunguCode: string;

  // 주소
  @Column({ nullable: true })
  address: string;

  // 경도
  @Column({ name: 'map_x', type: 'double', nullable: true })
  mapX: number;

  // 위도
  @Column({ name: 'map_y', type: 'double', nullable: true })
  mapY: number;

  // 검색수(추후 변경 가능성 있음)
  @Column({ nullable: true })
  rank: number;

  // 카테고리
  @Column({ name: 'category', nullable: true })
  category: string;

  // 대분류코드
  @Column({ name: 'cat1', nullable: true })
  cat1: string;

  // 중분류코드
  @Column({ name: 'cat1', nullable: true })
  cat2: string;

  // 장소 이미지
  @Column({ name: 'img_url', nullable: true })
  imgUrl: string;
}
