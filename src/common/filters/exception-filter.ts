import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

type MyResponseObj = {
  statusCode: number;
  success: boolean;
  timestamp: string;
  path: string;
  message: string | object;
};

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  //   private readonly logger = new MyLoggerService(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: 500,
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: '',
    };

    console.log('exception', exception);

    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.message = exception.message;
    } else if (
      exception instanceof PrismaClientValidationError ||
      exception instanceof PrismaClientKnownRequestError
    ) {
      myResponseObj.statusCode = 422;
      myResponseObj.message = exception.message.replaceAll(/\n/g, ' ');
    } else if (exception instanceof Error) {
      myResponseObj.statusCode = HttpStatus.BAD_REQUEST;
      myResponseObj.message = exception.message;
    } else {
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.message = 'Internal Server Error';
    }

    response.status(myResponseObj.statusCode).json(myResponseObj);
    super.catch(exception, host);
  }
}
