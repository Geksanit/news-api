import express from 'express';
import { Sequelize } from 'sequelize/types';

import { createCategoryModel } from '../../models/category';

export const makeRouter = (sequelize: Sequelize) => {
  const CategoryModel = createCategoryModel(sequelize);
  const router = express.Router();

  // middleware that is specific to this router
  router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });
  // define the home page route
  router.get('/', (req, res) => {
    res.send('Category home page');
  });
  // define the about route
  router.get('/about', (req, res) => {
    res.json({ ja: 'ja' });
  });
  return router;
};
