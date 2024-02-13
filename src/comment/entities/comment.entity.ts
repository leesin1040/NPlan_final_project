import { IsNotEmpty, IsString } from 'class-validator';
import { Article } from 'src/article/entities/article.entity';
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

  @ManyToOne(() => Article, (article) => article.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;
  @Column({ type: 'int', unsigned: true })
  articleId: number;

  @ManyToOne(() => Travel, (travel) => travel.comment)
  @JoinColumn({ name: 'travel_id' })
  travel: Travel[];

  /**유저에서 닉네임 불러오기 */
  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  userId: number;
}
