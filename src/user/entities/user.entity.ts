import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { RefreshToken } from 'src/auth/entities/refreshToken.entity';
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
  @PrimaryGeneratedColumn({ unsigned: true })
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
}
