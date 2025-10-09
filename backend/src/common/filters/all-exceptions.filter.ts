import { Catch, ExceptionFilter, ArgumentsHost, HttpException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
