import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('membesr')
export class Member {
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**멤버는 뭘로 추가하는가
  여행아이디, 유저아이디 */

  @ManyToOne(() => User, (user) => user.member)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @ManyToOne(() => Travel, (travel) => travel.member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;
  @Column({ type: 'int', unsigned: true })
  travel_id: number;
}
