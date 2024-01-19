import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { RefreshToken } from 'src/auth/entities/refreshToken.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Member } from 'src/member/entities/member.entity';
import { Travel } from 'src/travel/entities/travel.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('email', ['email'], { unique: true })
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  /**
   *이름
   * @example "홍길동"
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @Column()
  name: string;

  /**
   *휴대전화 번호
   * @example "01012345678"
   */
  @ApiProperty()
  @IsNotEmpty({ message: '전화번호를 입력해주세요' })
  @Column()
  phone: string;

  /**
   *이메일
   * @example "example@email.com"
   */
  @ApiProperty()
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  /**
   *비밀번호
   * @example "123123"
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  // @IsStrongPassword(
  //   {},
  //   {
  //     message:
  //       '비밀번호는 영문 알파벳 대소문자, 숫자, 특수문자를 포함해야 합니다.',
  //   },
  // )
  @Column({ type: 'varchar', select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken[];

  // Travel 1:N
  @OneToMany(() => Travel, (travel) => travel.user)
  travel: Travel[];

  // Travel_member 1:N
  @OneToMany(() => Member, (member) => member.user)
  member: Travel[];

  // Like 1:N
  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  // Comment 1:N
  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @Column({ type: 'text', nullable: true, name: 'image_url' })
  imageUrl: string;
}
