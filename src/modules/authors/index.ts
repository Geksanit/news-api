import express from 'express';
import { Sequelize } from 'sequelize/types';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { createAuthorModel, getAuthorFromInstance, attributes } from '../../models/author';

export const makeRouter = (sequelize: Sequelize) => {
  const AuthorModel = createAuthorModel(sequelize);
  const router = express.Router();

  router.use(createLogger(module));

  router.get('/', async (req, res, next) => {
    try {
      const authors = await AuthorModel.findAll({ attributes });
      res.json(authors);
    } catch (error) {
      next(error);
    }
  });
  router.post('/', async (req, res, next) => {
    try {
      const instance = await AuthorModel.create(req.body);
      res.status(201).send(getAuthorFromInstance(instance));
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', async (req, res, next) => {
    try {
      await AuthorModel.update(req.body, { where: { id: req.body.id } });
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
      const author = await AuthorModel.findOne({
        where: { id },
      });
      res.json(author);
    } catch (error) {
      next(error);
    }
  });
  router.delete('/:id', async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req;
      const author = await AuthorModel.findOne({
        where: { id },
      });
      if (!author) {
        throw new HttpError(400, 'not found author');
      }
      await AuthorModel.destroy({
        where: { id },
      });
      res.send('deleted');
    } catch (error) {
      next(error);
    }
  });

  return router;
};
