import { NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { BadRequestError, ConflictError } from '../errors/index';

const handleMongooseError = (error: unknown, next: NextFunction): void => {
  if (error instanceof MongooseError.ValidationError) {
    const errors = Object.values(error.errors).map((err) => err.message);
    return next(new BadRequestError(`Ошибка валидации: ${errors.join(', ')}`));
  }

  if (error instanceof MongooseError.CastError) {
    return next(new BadRequestError('Неверный формат ID'));
  }

  // Обработка дубликатов
  if (error instanceof Error && 'code' in error && error.code === 11000) {
    const { keyValue } = (error as any);
    if (keyValue?.title) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }
    if (keyValue?.email) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(new ConflictError('Запись уже существует'));
  }

  return next(error);
};

export default handleMongooseError;
