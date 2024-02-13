import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const errorResponse =
        typeof exceptionResponse === 'string' ? { message: exceptionResponse } : exceptionResponse;

      // 404 에러일 경우에만 에러페이지로 보내기
      if (status === HttpStatus.NOT_FOUND) {
        const redirectUrl = `/error-page?errorUrl=${encodeURIComponent(request.url)}`;
        response.status(status).redirect(redirectUrl);
      } else {
        // 기존 에러 응답 구조를 유지
        response.status(status).json({
          ...errorResponse,
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }
    } else {
      // HttpException이 아닌 경우, 내부 서버 에러로 처리
      const redirectUrl = `/error-page?errorUrl=${encodeURIComponent(request.url)}`;
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).redirect(redirectUrl);
    }
  }
}
