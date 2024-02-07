import { IsNotEmpty, IsString } from 'class-validator';
import { Like } from 'src/like/entities/like.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @IsString()
  @IsNotEmpty({ message: '게시글 제목을 입력해주세요.' })
  @Column({ name: 'article_title', type: 'varchar' })
  articleTitle: string;

  @IsString()
  @IsNotEmpty({ message: '게시글 내용을 입력해주세요.' })
  @Column({ name: 'article_content', type: 'longtext' })
  editorContent: string;

  @Column({ name: 'views', type: 'int', default: 0 })
  views: number;

  @Column({ name: 'likes_count', type: 'int', default: 0 })
  likesCount: number;

  /** 외래키들 */
  @ManyToOne(() => User, (user) => user.article, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', unsigned: true })
  userId: number;

  @OneToOne(() => Travel, (travel) => travel.article)
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;
  @Column({ type: 'int', unsigned: true, nullable: true })
  travelId: number;

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
