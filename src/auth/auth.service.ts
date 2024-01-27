import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { RefreshToken } from './entities/refreshToken.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /**회원가입 */
  async register({ name, email, phone, password, passwordConfirm }: RegisterDto) {
    const passwordMatch = password === passwordConfirm;
    if (!passwordMatch) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }

    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);
    const user = await this.userRepository.save({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    return this.login(user.id);
  }
  /**로그인 */
  async login(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = new RefreshToken();

    const user = await this.userRepository.findOne({ where: { id: userId } });
    refreshToken.user = user;
    refreshToken.token = this.jwtService.sign(payload);
    refreshToken.expiryDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    await this.refreshTokenRepository.save(refreshToken);
    return { accessToken: accessToken };
  }

  /**유저 확인 */
  async validateUser({ email, password }: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    const passwordMatch = bcrypt.compareSync(password, user?.password ?? '');
    if (!user || !passwordMatch) {
      return null;
    }
    return { id: user.id };
  }
  //jwt.strategy.ts 파일에 유저 정보 넘겨주기 위한 함수
  async findByUserId(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async refresh(refreshToken: string) {
    const savedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });
    if (!savedToken || savedToken.expiryDate < new Date()) {
      throw new BadRequestException('유효하지 않은 토큰입니다.');
    }
    const payload = { id: savedToken.user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
