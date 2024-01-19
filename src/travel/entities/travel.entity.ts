import { IsNotEmpty, IsString } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';
import { Day } from 'src/day/entities/day.entity';
import { Like } from 'src/like/entities/like.entity';
import { Member } from 'src/member/entities/member.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('travels')
export class Travel {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  /**
   * 여행 타이틀
   * @example "서울가자"
   * */
  @IsString()
  @IsNotEmpty({ message: '여행의 이름을 입력해 주세요' })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  /**
   * 배경 컬러
   * @example "#fffff"
   * */
  @IsString()
  @Column({ type: 'varchar', nullable: false, default: '#ffffff' })
  color: string;

  /**
   * 여행 지역
   * @example "서울"
   * */
  @Column({ type: 'varchar', nullable: false })
  region: string;

  /**
   * 여행 테마
   * @example "역사"
   * */
  @Column({ type: 'varchar', nullable: false })
  theme: string;

  /**
   * 여행 시작 날짜
   * @example "2024-01-30"
   * */
  @Column({ type: 'date', nullable: false })
  start_date: Date;

  /**
   * 여행 종료 날짜
   * @example "2024-01-30"
   * */
  @Column({ type: 'date', nullable: false })
  end_date: Date;

  /** 외래키들 */
  @ManyToOne(() => User, (user) => user.travel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  user_id: number;

  @OneToMany(() => Like, (like) => like.travel, { nullable: true })
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.travel, { nullable: true })
  comment: Comment[];

  @OneToMany(() => Member, (member) => member.travel)
  member: Member[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Day, (day) => day.travel, { nullable: true })
  day: Day[];
}
