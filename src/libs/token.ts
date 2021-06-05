import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY } from '../constants';

type TokenPayload = { userId: number; counter: number };

export const getToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 60 * 60 });
};

export const getPayload = (token: string) => {
  return jwt.verify(token, JWT_SECRET_KEY) as TokenPayload;
};
