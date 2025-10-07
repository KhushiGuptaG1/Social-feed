import { Catch, ExceptionFilter, ArgumentsHost, HttpException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from '../../logs/logs.service';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logsService: LogsService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    if (status === 500) {
      await this.logsService.logError({
        message: (exception as Error).message,
        stack: (exception as Error).stack,
        timestamp: new Date(),
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}