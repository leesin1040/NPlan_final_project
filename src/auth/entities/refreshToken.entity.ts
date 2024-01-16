import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'refresh_token' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expiryDate: Date;

  @ManyToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
