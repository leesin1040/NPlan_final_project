import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class RegisterDto extends PickType(User, ['name', 'phone', 'email', 'password']) {
  /**
   *비밀번호
   *@example "123123"
   */
  @ApiProperty()
  @IsNotEmpty({ message: '확인용 비밀번호를 입력해주세요.' })
  // @IsStrongPassword(
  //   {},
  //   {
  //     message:
  //       '비밀번호는 영문 알파벳 대소문자, 숫자, 특수문자를 포함해야 합니다.',
  //   },
  // )
  @IsString()
  passwordConfirm: string;

  @IsNotEmpty()
  readonly authNumber: number;
}
