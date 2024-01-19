import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dtos/changepassword.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**유저 조회 */
  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  /**비밀번호 변경 */
  async changePassword({ password, newPassword, passwordConfirm }: ChangePasswordDto, id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      select: { id: true, password: true },
    });
    const isPasswordMatched = bcrypt.compareSync(password, user?.password ?? '');
    if (!isPasswordMatched) {
      throw new BadRequestException('입력하신 비밀번호가 기존 비밀번호와 일치하지 않습니다.');
    }
    const passwordSame = bcrypt.compareSync(newPassword, user?.password ?? '');
    if (passwordSame) {
      throw new BadRequestException('사용중인 비밀번호와 변경된 내용이 없습니다.');
    }
    /**새 비밀번호 일치 확인 */
    const isNewPasswordMatched = newPassword === passwordConfirm;
    if (!isNewPasswordMatched) {
      throw new BadRequestException('입력하신 새 비밀번호와 확인용 비밀번호가 일치하지 않습니다.');
    }
    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedNewPassword = bcrypt.hashSync(newPassword, hashRounds);
    await this.userRepository.update(id, {
      password: hashedNewPassword,
    });

    return { message: '비밀번호 수정 완료' };
  }

  //회원탈퇴
  async deleteUser(id: number) {
    await this.findOneById(id);
    await this.userRepository.softDelete({ id });
  }

  //회원 이름으로 아이디 조회
  async findOneByName(name: string): Promise<User> {
    try {
      console.log('name', name);
      const findUserId = await this.userRepository.findOne({
        where: { name },
      });
      console.log('findUserId서비스', findUserId);
      return findUserId;
    } catch (err) {
      console.log(err);
    }
  }

  // // 유저 이미지 수정
  // async updateUserImage(id: number, file: Express.Multer.File) {
  //   const user = await this.userRepository.findOne(id);

  //   if (!user) {
  //     throw new NotFoundException('사용자를 찾을 수 없습니다.');
  //   }
  // }
}
