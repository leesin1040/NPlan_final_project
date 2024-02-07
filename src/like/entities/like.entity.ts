import { Article } from 'src/article/entities/article.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('like')
export class Like {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Article, (article) => article.like, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article: Article;
  @Column({ type: 'int', unsigned: true })
  articleId: number;

  @ManyToOne(() => User, (user) => user.like, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  userId: number;
}
