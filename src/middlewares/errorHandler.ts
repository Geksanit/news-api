import { ErrorRequestHandler } from 'express';

import { log } from '../libs/log';

export const createModuleErrorHandler = (module: NodeModule): ErrorRequestHandler => (
  err,
  req,
  res,
  next,
) => {
  const path = module.filename.split('\\').slice(-2).join('/');
  log.error(`${path} ${req.method} ${err}`);
  next(err);
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // next argument required
  const status = err.status || 500;
  if (status === 500 && err.stack) {
    log.error(`${req.method} ${req.path} ${err.stack}`);
  } else {
    log.info(`${req.method} ${req.path} ${status} ${err.message}`);
  }
  res.status(status).json({
    message: err.message,
    errors: err.errors,
  });
};
