import { IsNotEmpty, IsString } from 'class-validator';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number;

  @IsString()
  @IsNotEmpty({ message: '코멘트를 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  comment: string;

  @ManyToOne(() => Article, (article) => article.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;
  @Column({ type: 'int', unsigned: true })
  articleId: number;

  /**유저에서 닉네임 불러오기 */
  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
