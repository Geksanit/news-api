import express from 'express';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { getCategoryFromInstance } from '../../models/category';
import { authenticateAdmin } from '../../middlewares/authenticate';
import { Pagination } from '../../types/generated';
import { ModelsStore } from '../../models/models.store';

export const makeRouter = ({ CategoryModel }: ModelsStore) => {
  const router = express.Router();
  router.use(createLogger(module));

  router.get('/', async (req, res, next) => {
    try {
      const { limit, offset } = (req.query as unknown) as Pagination;
      const categories = await CategoryModel.findAll({
        limit,
        offset,
        attributes: ['id', 'label', 'parentCategoryId'],
      });
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });
  router.post('/', authenticateAdmin, async (req, res, next) => {
    try {
      const parentCategory = await CategoryModel.findOne({
        where: { id: req.body.parentCategoryId },
      });
      if (req.body.parentCategoryId !== null && !parentCategory) {
        throw new HttpError(400, 'not found parent category');
      }
      const instance = await CategoryModel.create(req.body);
      res.status(201).send(getCategoryFromInstance(instance));
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', authenticateAdmin, async (req, res, next) => {
    try {
      await CategoryModel.update(req.body, { where: { id: req.body.id } });
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
      const category = await CategoryModel.findOne({
        where: { id },
      });
      if (!category) {
        throw new HttpError(400, 'not found category');
      }
      const subcategories = await CategoryModel.findAll({
        where: { parentCategoryId: id },
      });
      if (subcategories.length > 0) {
        throw new HttpError(400, 'you cannot delete a category with subcategories');
      }
      await CategoryModel.destroy({
        where: { id },
      });
      res.send('deleted');
    } catch (error) {
      next(error);
    }
  });

  return router;
};
