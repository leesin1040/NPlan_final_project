import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    if (request.url !== '/favicon.ico') {
      console.error(`에러가 난 페이지=================[${request.method}] ${request.url}`);
    }
    const redirectUrl = `/error-page?errorUrl=${encodeURIComponent(request.url)}`;
    response.status(status).redirect(redirectUrl);
  }
}
