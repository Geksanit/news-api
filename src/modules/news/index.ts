import express from 'express';
import { Sequelize } from 'sequelize/types';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { createNewsModel, createNewsToModel, getNewsFromInstance } from '../../models/news';
import { authenticateAdmin, authenticateUser } from '../../middlewares/authenticate';
import { CreateNews, News, UserView } from '../../types/generated';
import { createAuthorModel } from '../../models/author';

export const makeRouter = (sequelize: Sequelize) => {
  const NewsModel = createNewsModel(sequelize);
  const AuthorModel = createAuthorModel(sequelize);
  const router = express.Router();
  router.use(createLogger(module));

  router.get('/', async (req, res, next) => {
    try {
      const news = await NewsModel.findAll({
        attributes: ['id', 'label'],
      });
      res.json(news);
    } catch (error) {
      next(error);
    }
  });
  router.get('/:id', async (req, res, next) => {
    try {
      const news = await NewsModel.findAll({
        attributes: ['id', 'label'],
      });
      res.json(news);
    } catch (error) {
      next(error);
    }
  });
  router.post('/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const news = req.body as CreateNews;
      const author = await AuthorModel.findOne({ where: { userId: user.id } });
      if (!author) {
        throw new HttpError(400, 'user is not author');
      }
      const instance = await NewsModel.create(createNewsToModel({ ...news, authorId: user.id }));
      res.status(201).send(getNewsFromInstance(instance));
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const updatedNews = req.body as News;
      const author = await AuthorModel.findOne({ where: { userId: user.id } });
      if (!author) {
        throw new HttpError(400, 'user is not author');
      }
      const news = await NewsModel.findOne({ where: { id: updatedNews } });
      if (!news || user.id !== news.authorId) {
        throw new HttpError(400, 'not found news');
      }
      await NewsModel.update(req.body, { where: { id: req.body.id } });
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
      const news = await NewsModel.findOne({
        where: { id },
      });
      if (!news) {
        throw new HttpError(400, 'not found news');
      }
      await NewsModel.destroy({
        where: { id },
      });
      res.send('deleted');
    } catch (error) {
      next(error);
    }
  });

  return router;
};
