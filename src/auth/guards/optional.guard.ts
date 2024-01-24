import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginOrNotGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
      return true;
    } catch (error) {
      const request = context.switchToHttp().getRequest();
      request.user = null; // 사용자가 없음
      return true; // 인증되지 않았어도 접근을 허용
    }
  }
}
