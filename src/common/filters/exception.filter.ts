import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 모든 예외에 대해 상태 코드와 메시지를 결정
    let errorMessage = 'An unexpected error occurred';
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      errorMessage =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string }).message || errorMessage;
    }

    // 404 Not Found 또는 500 Internal Server Error일 때 에러 페이지로 리다이렉트
    if (status === HttpStatus.NOT_FOUND || status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const redirectUrl = `/error-page?errorUrl=${encodeURIComponent(
        request.url,
      )}&statusCode=${status}&errorMessage=${encodeURIComponent(errorMessage)}`;
      response.redirect(redirectUrl);
    } else {
      // 그 외의 경우에는 일반적인 JSON 응답을 반환
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: errorMessage,
      });
    }
  }
}
