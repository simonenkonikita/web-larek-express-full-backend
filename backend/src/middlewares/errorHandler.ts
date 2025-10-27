import { Request, Response, NextFunction } from 'express';
import { statusCode } from '../errors/index';

const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = error.statusCode || statusCode.INTERNAL_SERVER_ERROR;
  const message = error.message || 'На сервере произошла ошибка';

  res.status(status).json({
    success: false,
    message,
  });
};

export default errorHandler;
