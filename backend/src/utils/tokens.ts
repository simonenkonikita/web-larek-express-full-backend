import jwt from 'jsonwebtoken';
import ms from 'ms';
import { Response } from 'express';
import { TokenPayload } from '../types/tokens';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

export const generateAccessToken = (payload: TokenPayload): string => (
  jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
);

export const generateRefreshToken = (payload: TokenPayload): string => (
  jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
);

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie('REFRESH_TOKEN', refreshToken, {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    maxAge: ms('7d'),
    path: '/',
  });
};

export const clearTokenCookie = (res: Response): void => {
  res.clearCookie('REFRESH_TOKEN', {
    sameSite: 'lax',
    secure: false,
    httpOnly: true,
    path: '/',
  });
};

export const verifyAccessToken = (token: string): TokenPayload => (
  jwt.verify(token, JWT_SECRET) as TokenPayload
);

export const verifyRefreshToken = (token: string): TokenPayload => (
  jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload
);

export const extractBearerToken = (header: string): string => (
  header.replace('Bearer ', '')
);
