import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import {
  BadRequestError,
  ConflictError,
  statusCode,
  UnauthorizedError,
} from '../errors/index';
import {
  clearTokenCookie,
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  verifyRefreshToken,
} from '../utils/tokens';
import { TokenPayload } from '../types/tokens';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError('Email и пароль обязательны'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new UnauthorizedError('Неправильная почта или пароль'));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return next(new UnauthorizedError('Неправильная почта или пароль'));
    }

    const accessToken = generateAccessToken({ _id: user._id.toString() });
    const refreshToken = generateRefreshToken({ _id: user._id.toString() });

    user.tokens = user.tokens || [];
    user.tokens.push(refreshToken);
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.status(statusCode.OK).send({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new BadRequestError('Все поля обязательны для заполнения'));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new ConflictError('Пользователь уже существует'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tokens: [],
    });

    const accessToken = generateAccessToken({ _id: user._id.toString() });
    const refreshToken = generateRefreshToken({ _id: user._id.toString() });

    user.tokens.push(refreshToken);
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.status(statusCode.CREATED).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      if (error.message.includes('email')) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return next(error);
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Ошибка валидации данных при создании пользователя'));
    }
    return next(error);
  }
};

export const refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.REFRESH_TOKEN;

    if (!refreshToken) {
      return next(new UnauthorizedError('Необходима авторизация, токен не найден'));
    }
    try {
      let payload: TokenPayload;

      try {
        payload = verifyRefreshToken(refreshToken);
      } catch (_error) {
        return next(new UnauthorizedError('Необходима авторизация'));
      }

      const user = await User.findById(payload._id).select('+tokens');

      if (!user || !user.tokens.includes(refreshToken)) {
        return next(new UnauthorizedError('Пользователь не найден или необходима авторизация'));
      }

      const newAccessToken = generateAccessToken({ _id: user._id.toString() });
      const newRefreshToken = generateRefreshToken({ _id: user._id.toString() });

      user.tokens = user.tokens.filter((token) => token !== refreshToken);
      user.tokens.push(newRefreshToken);
      await user.save();

      setRefreshTokenCookie(res, newRefreshToken);

      return res.status(statusCode.OK).json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        accessToken: newAccessToken,
      });
    } catch (_error) {
      return next(new UnauthorizedError('Недействительный токен'));
    }
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.REFRESH_TOKEN;

    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        const user = await User.findById(payload._id);

        if (user) {
          user.tokens = user.tokens.filter((token) => token !== refreshToken);
          await user.save();
        }
      } catch (_error) {
        // Игнорируем ошибки верификации токена при выходе
      }
    }

    clearTokenCookie(res);

    return res.status(statusCode.OK).json({
      success: true,
      message: 'Успешный выход из системы',
    });
  } catch (error) {
    return next(error);
  }
};
