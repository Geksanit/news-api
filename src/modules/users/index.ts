import express from 'express';
import { Sequelize } from 'sequelize/types';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { createUserModel, getUserFromInstance, attributes } from '../../models/user';

export const makeRouter = (sequelize: Sequelize) => {
  const UserModel = createUserModel(sequelize);
  const router = express.Router();

  router.use(createLogger(module));

  router.get('/', async (req, res, next) => {
    try {
      const users = await UserModel.findAll({ attributes });
      res.json(users);
    } catch (error) {
      next(error);
    }
  });
  router.post('/', async (req, res, next) => {
    try {
      const instance = await UserModel.create(req.body);
      res.status(201).send(getUserFromInstance(instance));
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', async (req, res, next) => {
    try {
      await UserModel.update(req.body, { where: { id: req.body.id } });
      res.send('updated');
    } catch (error) {
      next(error);
    }
  });
  router.get('/:id', async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req;
      const user = await UserModel.findOne({
        where: { id },
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  });
  router.delete('/:id', async (req, res, next) => {
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

  return router;
};
