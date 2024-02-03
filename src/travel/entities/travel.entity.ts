import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Article } from 'src/article/entities/article.entity';
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

@Entity('travel')
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
  @IsNotEmpty({ message: '여행 보드 컬러를 설정해주세요' })
  @Column({ type: 'varchar', nullable: false, default: '#ffffff' })
  color: string;

  /**
   * 여행 지역
   * @example "서울"
   * */
  @IsNotEmpty({ message: '여행지역을 설정해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  region: string;

  /**
   * 여행 테마
   * @example "역사"
   * */
  @IsNotEmpty({ message: '여행테마를 설정해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  theme: string;

  /**
   * 여행 시작 날짜
   * @example "2024-01-30"
   * */
  @IsNotEmpty({ message: '여행 시작일자를 설정해주세요.' })
  @Column({ type: 'date', nullable: false })
  start_date: Date;

  /**
   * 여행 종료 날짜
   * @example "2024-02-03"
   * */
  @IsNotEmpty({ message: '여행 종료일자를 설정해주세요.' })
  @Column({ type: 'date', nullable: false })
  end_date: Date;

  /** 외래키들 */
  @ManyToOne(() => User, (user) => user.travel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  userId: number;

  @OneToMany(() => Like, (like) => like.travel, { nullable: true })
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.travel, { nullable: true })
  comment: Comment[];

  @OneToMany(() => Member, (member) => member.travel)
  member: Member[];

  @OneToMany(() => Article, (article) => article.travel)
  article: Article[];

  @OneToMany(() => Day, (day) => day.travel, { nullable: true })
  day: Day[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
