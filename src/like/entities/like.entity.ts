import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Travel, (travel) => travel.like, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;
  @Column({ type: 'int', unsigned: true })
  travel_id: number;

  @ManyToOne(() => User, (user) => user.like, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  user_id: number;
}
