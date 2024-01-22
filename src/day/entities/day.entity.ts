import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('day')
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Travel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;

  @OneToMany(() => Schedule, (schedule) => schedule.day)
  schedules: Schedule[];

  @Column({ nullable: true })
  day: number;
}
