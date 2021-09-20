import express from 'express';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { getAuthorFromInstance, attributes } from '../../models/author';
import { authenticateAdmin } from '../../middlewares/authenticate';
import { Pagination } from '../../types/generated';
import { ModelsStore } from '../../models/models.store';

export const makeRouter = ({ AuthorModel }: ModelsStore) => {
  const router = express.Router();
  router.use(createLogger(module));

  router.get('/', authenticateAdmin, async (req, res, next) => {
    try {
      const { limit, offset } = (req.query as unknown) as Pagination;
      const authors = await AuthorModel.findAll({ limit, offset, attributes });
      res.json(authors);
    } catch (error) {
      next(error);
    }
  });
  router.post('/', authenticateAdmin, async (req, res, next) => {
    try {
      const instance = await AuthorModel.create(req.body);
      res.status(201).send(getAuthorFromInstance(instance));
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', authenticateAdmin, async (req, res, next) => {
    try {
      await AuthorModel.update(req.body, { where: { id: req.body.id } });
      res.send('updated');
    } catch (error) {
      next(error);
    }
  });
  router.get('/:id', authenticateAdmin, async (req, res, next) => {
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
  router.delete('/:id', authenticateAdmin, async (req, res, next) => {
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
