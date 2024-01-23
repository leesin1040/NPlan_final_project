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

  @Column({ name: 'map_x', nullable: true })
  mapX: string;

  @Column({ name: 'map_y', nullable: true })
  mapY: string;

  @Column({ nullable: true })
  raiting: string;

  @Column({ name: 'category', nullable: true })
  category: string;

  @Column({ name: 'content_id', nullable: true })
  contentId: string;
}
