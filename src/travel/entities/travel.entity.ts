import { IsNotEmpty, IsString } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Member } from 'src/member/entities/member.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('travels')
export class Travel {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsString()
  @IsNotEmpty({ message: '여행의 이름을 입력해 주세요' })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false, default: '#ffffff' })
  color: string;

  @Column({ type: 'varchar', nullable: false })
  region: string;

  @Column({ type: 'varchar', nullable: false })
  theme: string;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;

  /** 외래키들 */
  @ManyToOne(() => User, (user) => user.travel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @OneToMany(() => Like, (like) => like.travel, { nullable: true })
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.travel, { nullable: true })
  comment: Comment[];

  @OneToMany(() => Member, (member) => member.travel)
  member: Member[];
}
