import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('day')
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Travel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;

  @Column({ length: 255, nullable: true })
  day: number;
}
