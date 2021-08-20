import express from 'express';
import { Sequelize } from 'sequelize/types';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { createTagModel, getTagFromInstance } from '../../models/tags';
import { authenticateAdmin } from '../../middlewares/authenticate';
import { Pagination } from '../../types/generated';

export const makeRouter = (sequelize: Sequelize) => {
  const TagModel = createTagModel(sequelize);
  const router = express.Router();
  router.use(createLogger(module));

  router.get('/', async (req, res, next) => {
    try {
      const { limit, offset } = (req.query as unknown) as Pagination;
      const tags = await TagModel.findAll({
        limit,
        offset,
        attributes: ['id', 'label'],
      });
      res.json(tags);
    } catch (error) {
      next(error);
    }
  });
  router.post('/', authenticateAdmin, async (req, res, next) => {
    try {
      const instance = await TagModel.create(req.body);
      res.status(201).send(getTagFromInstance(instance));
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', authenticateAdmin, async (req, res, next) => {
    try {
      await TagModel.update(req.body, { where: { id: req.body.id } });
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
      const tag = await TagModel.findOne({
        where: { id },
      });
      if (!tag) {
        throw new HttpError(400, 'not found tag');
      }
      await TagModel.destroy({
        where: { id },
      });
      res.send('deleted');
    } catch (error) {
      next(error);
    }
  });

  return router;
};
