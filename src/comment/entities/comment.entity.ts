import { IsNotEmpty, IsString } from 'class-validator';
import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  @IsString()
  @IsNotEmpty({ message: '코멘트를 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  comment: string;

  @ManyToOne(() => Travel, (travel) => travel.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;
  @Column({ type: 'int', unsigned: true })
  travelId: number;

  /**유저에서 닉네임 불러오기 */
  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  userId: number;
}
