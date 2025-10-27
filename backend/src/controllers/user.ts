import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { TokenPayload } from '../types/tokens';
import handleMongooseError from '../utils/handleMongooseError';
import {
  BadRequestError,
  ConflictError,
  statusCode,
  UnauthorizedError,
} from '../errors/index';

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.user as TokenPayload;

    const user = await User.findById(payload._id).select('_id email name');

    if (!user) {
      return next(new UnauthorizedError('Пользователь не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    return res.status(statusCode.OK).json({
      success: true,
      total: users.length,
      user: users,
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const updatedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError('ID пользователя не указан'));
    }

    const updateData = req.body;

    const updateUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updateUser) {
      return next(new ConflictError('Пользователь для обновления не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      product: updateUser,
      message: 'Пользователь успешно обновлен',
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};

export const removalUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError('ID пользователя не указан'));
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return next(new ConflictError('Пользователь не найден'));
    }

    return res.status(statusCode.OK).json({
      success: true,
      product: deletedUser,
      message: 'Пользователь успешно удален',
    });
  } catch (error) {
    return handleMongooseError(error, next);
  }
};
