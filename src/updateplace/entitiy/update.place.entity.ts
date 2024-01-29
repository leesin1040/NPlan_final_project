import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('place')
export class UpdatePlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'map_x', nullable: true })
  mapX: string;

  @Column({ name: 'map_y', nullable: true })
  mapY: string;

  @Column({ nullable: true })
  raiting: number;

  @Column({ name: 'category', nullable: true })
  category: string;

  @Column({ name: 'content_id', nullable: true })
  contentId: string;

  @Column({ name: 'img_url', nullable: true })
  imgUrl: string;
}
