import jwt from 'jsonwebtoken';

import { getConfig } from '../config';

const config = getConfig();
type TokenPayload = { userId: number; counter: number };

export const getToken = (payload: TokenPayload) => {
  return jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
};

export const getPayload = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET_KEY) as TokenPayload;
};
