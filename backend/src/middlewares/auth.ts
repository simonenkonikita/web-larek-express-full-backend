import { Request, Response, NextFunction } from 'express';
import { extractBearerToken, verifyAccessToken } from '../utils/tokens';
import User from '../models/user';
import { UnauthorizedError } from '../errors/index';

const auth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }

    const token = extractBearerToken(authorization);
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload._id).select('_id tokens');

    if (!user) {
      return next(new UnauthorizedError('Пользователь не найден'));
    }

    if (!user.tokens || user.tokens.length === 0) {
      return next(new UnauthorizedError('Пользователь не найден'));
    }

    req.user = payload;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default auth;
