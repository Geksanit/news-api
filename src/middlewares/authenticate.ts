/* eslint-disable @typescript-eslint/no-unused-vars */
import passport from 'passport';

import { UserView } from '../types/generated';
import { HttpError } from '../utils/Errors';

export const authenticateUser = (req: any, res: any, next: any) => {
  passport.authenticate('cookie', (err, user: UserView, info: any) => {
    if (err) {
      if (err.message === 'jwt expired') {
        return next(new HttpError(401, 'token expired'));
      }
      return next(err);
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authenticateAdmin = (req: any, res: any, next: any) => {
  passport.authenticate('cookie', (err, user: UserView, info: any) => {
    if (err) {
      if (err.message === 'jwt expired') {
        return next(new HttpError(401, 'token expired'));
      }
      return next(err);
    }
    if (!user.isAdmin) {
      return res.status(404).send();
    }
    req.user = user;
    next();
  })(req, res, next);
};
