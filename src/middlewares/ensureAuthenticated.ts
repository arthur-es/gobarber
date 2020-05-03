import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../errors/AppError';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('You need to provide authorization token', 401);
  }

  const [, token] = authHeader.split(' ');

  const decoded = verify(token, authConfig.jwt.secret);

  const { sub } = decoded as TokenPayload;

  request.user = {
    id: sub,
  };
  return next();
}
