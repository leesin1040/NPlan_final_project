import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('day')
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Travel, (travel) => travel.day, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;
  @Column({ type: 'int', unsigned: true })
  travelId: number;

  @OneToMany(() => Schedule, (schedule) => schedule.day)
  schedule: Schedule[];

  @Column({ nullable: true })
  day: number;

  @Column({ type: 'longtext', nullable: true })
  directions: string;

  @Column({ type: 'json', nullable: true, name: 'place_path' })
  placePath: number[];
}
