import { ErrorRequestHandler } from 'express';

import { log } from '../libs/log';

export const createErrorHandler = (module: NodeModule): ErrorRequestHandler => (
  err,
  req,
  res,
  next,
) => {
  const path = module.filename.split('\\').slice(-2).join('/');
  log.error(`${path} ${req.method} ${err}`);
  next(err);
};
