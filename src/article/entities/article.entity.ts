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
  OneToOne,
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
  @Column({ name: 'article_content', type: 'longtext' })
  editorContent: string;

  @Column({ name: 'views', type: 'int', default: 0 })
  views: number;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
