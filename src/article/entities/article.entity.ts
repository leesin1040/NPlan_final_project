import { IsNotEmpty, IsString } from 'class-validator';
import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty({ message: '게시글 제목을 입력해주세요.' })
  @Column({ name: 'article_title', type: 'varchar' })
  articleTitle: string;

  @IsString()
  @IsNotEmpty({ message: '게시글 내용을 입력해주세요.' })
  @Column({ name: 'article_content', type: 'varchar' })
  articleContent: string;

  @IsString()
  @Column({ name: 'img_url', type: 'varchar', nullable: true })
  imageUrl: string;

  /** 외래키들 */
  @ManyToOne(() => User, (user) => user.article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  userId: number;

  @Column({ default: 0 })
  likesCount: number;

  @ManyToOne(() => Travel, (travel) => travel.article)
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;
  @Column({ type: 'int', unsigned: true })
  travelId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
