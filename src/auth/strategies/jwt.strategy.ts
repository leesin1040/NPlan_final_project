import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';
import _ from 'lodash';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        jwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  private static extractJWT(request: any): string | null {
    return request?.cookies?.Authorization;
  }
  async validate(payload: JwtPayLoad) {
    const user = await this.authService.findByUserId(payload.id);

    if (_.isNil(user)) {
      throw new UnauthorizedException('해당되는 사용자를 찾을 수 없습니다.');
    }
    // console.log('jwt findUser', findUser);
    return user;
  }
}
