import passport from 'passport';
import { Strategy as CookieStrategy } from 'passport-cookie';
import { Strategy as LocalStrategy } from 'passport-local';
import { Sequelize } from 'sequelize/types';
import * as core from 'express-serve-static-core';

import { createUserModel, getUserViewFromInstance } from './models/user';
import { getHash } from './libs/passwordHash';
import { getPayload } from './libs/token';

export const initializeAuth = (app: core.Express, sequelize: Sequelize) => {
  app.use(passport.initialize());

  const UserModel = createUserModel(sequelize);

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await UserModel.findOne({
        where: { username },
      });
      if (!user) {
        return done(null, false);
      }
      const passwordHash = await getHash(password);
      if (passwordHash === user.passwordHash) {
        return done(null, { id: user.id });
      }
      done(null, false);
    }),
  );

  passport.use(
    new CookieStrategy(
      {
        cookieName: 'jwt',
        signed: false,
      },
      async (token: string, done: any) => {
        try {
          const payload = getPayload(token);
          const user = await UserModel.findOne({
            where: { id: payload.userId },
          });
          if (user.tokenCounter !== payload.counter) {
            return done(new Error('jwt expired'));
          }

          return done(null, getUserViewFromInstance(user));
        } catch (error) {
          done(error);
        }
      },
    ),
  );
};
