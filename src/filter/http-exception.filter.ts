import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    if (exception instanceof ThrottlerException) {
      return response.status(status).json({
        message: exception.message,
        code: `FXQL-${status}`,
      });
    }

    const exceptionMessage = exception.getResponse().message;

    if (exceptionMessage.constructor == Array) {
      response.status(status).json({
        message: exception.response.message[0],
        code: `FXQL-${status}`,
      });
    } else {
      response.status(status).json({
        message: exception.response.message,
        code: exception.response.code,
      });
    }
  }
}
