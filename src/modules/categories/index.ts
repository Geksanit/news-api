import express from 'express';
import { Sequelize } from 'sequelize/types';

import { createErrorHandler } from '../../middlewares/errorHandler';
import { createLogger } from '../../middlewares/logger';
import { createCategoryModel } from '../../models/category';

export const makeRouter = (sequelize: Sequelize) => {
  const CategoryModel = createCategoryModel(sequelize);
  const router = express.Router();

  router.use(createLogger(module));

  router.get('/', async (req, res, next) => {
    try {
      const users = await CategoryModel.findAll({ attributes: ['id', 'label'] });
      res.json(users);
    } catch (error) {
      next(error);
    }
  });
  router.post('/', async (req, res, next) => {
    try {
      await CategoryModel.create(req.body);
      res.send('created');
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', async (req, res, next) => {
    try {
      await CategoryModel.update(req.body, { where: { id: req.body.id } });
      res.send('updated');
    } catch (error) {
      next(error);
    }
  });
  router.delete('/', async (req, res, next) => {
    try {
      await CategoryModel.destroy({ where: { id: req.body.id } });
      res.send('deleted');
    } catch (error) {
      next(error);
    }
  });

  router.use(createErrorHandler(module));
  return router;
};
