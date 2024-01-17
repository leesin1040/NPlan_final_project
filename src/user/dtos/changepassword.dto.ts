import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class ChangePasswordDto extends PickType(User, ['password']) {
  /**
   * 새 비밀번호
   * @example "123123"
   */
  @ApiProperty()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  newPassword: string;

  /**
   * 확인용 비밀번호
   * @example "123123"
   */
  @ApiProperty()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString()
  passwordConfirm: string;
}
