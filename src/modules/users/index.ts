import express from 'express';
import { Sequelize } from 'sequelize/types';
import passport from 'passport';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import {
  createUserModel,
  createUserToModel,
  getUserViewFromInstance,
  userViewAttributes,
} from '../../models/user';
import { getToken } from '../../libs/token';
import { authenticateAdmin, authenticateUser } from '../../middlewares/authenticate';

export const makeRouter = (sequelize: Sequelize) => {
  const UserModel = createUserModel(sequelize);
  const router = express.Router();
  router.use(createLogger(module));

  router.post(
    '/login/',
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
      try {
        const { id } = req.user as { id: number };
        const instance = await UserModel.findOne({
          where: { id },
        });
        if (!instance) {
          return res.status(401).send();
        }
        const tokenCounter = instance.tokenCounter + 1;
        await UserModel.update({ tokenCounter }, { where: { id } });
        const token = getToken({ userId: id, counter: tokenCounter });

        res.cookie('jwt', token, { maxAge: 90000000, httpOnly: true });
        res.send({ user: getUserViewFromInstance(instance) });
      } catch (error) {
        next(error);
      }
    },
  );

  router.get('/', authenticateAdmin, async (req, res, next) => {
    try {
      const users = await UserModel.findAll({ attributes: userViewAttributes });
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const userModel = await createUserToModel(req.body);
      const instance = await UserModel.create(userModel);
      const user = getUserViewFromInstance(instance);
      const token = getToken({ userId: user.id, counter: 0 });

      res.cookie('jwt', token, { maxAge: 90000000, httpOnly: true });
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  });

  router.patch('/', authenticateAdmin, async (req, res, next) => {
    try {
      await UserModel.update(req.body, { where: { id: req.body.id } });
      res.send('updated');
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', authenticateAdmin, async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req;
      const user = await UserModel.findOne({
        where: { id },
      });
      if (!user) {
        throw new HttpError(400, 'not found user');
      }
      await UserModel.destroy({
        where: { id },
      });
      res.send('deleted');
    } catch (error) {
      next(error);
    }
  });

  router.get('/me', authenticateUser, async (req, res, next) => {
    try {
      res.status(200).send(req.user);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
