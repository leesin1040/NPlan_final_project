import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('place')
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => Schedule, (schedule) => schedule.place)
  schedule: Schedule[];

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'map_x', type: 'double', nullable: true })
  mapX: number;

  @Column({ name: 'map_y', type: 'double', nullable: true })
  mapY: number;

  @Column({ nullable: true })
  rank: number;

  @Column({ name: 'category', nullable: true })
  category: string;

  @Column({ name: 'cat1', nullable: true })
  cat1: string;

  @Column({ name: 'img_url', nullable: true })
  imgUrl: string;
}
