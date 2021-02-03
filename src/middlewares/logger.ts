import { RequestHandler } from 'express';

import { log } from '../libs/log';

export const createLogger = (module: NodeModule): RequestHandler => (req, res, next) => {
  const path = module.filename.split('\\').slice(-2).join('/');
  log.info(`${path} ${req.method}`);
  next();
};
