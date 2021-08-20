import express from 'express';
import { Sequelize, QueryTypes } from 'sequelize';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import {
  createNewsModel,
  createNewsToModel,
  getNewsFromInstance,
  newsAttributes,
} from '../../models/news';
import { authenticateAdmin, authenticateUser } from '../../middlewares/authenticate';
import { CreateNews, News, NewsOrder, Pagination, UserView } from '../../types/generated';
import { createAuthorModel } from '../../models/author';
import {
  authorToJSON,
  categoryToJSON,
  CreatedAtFilter,
  Filters,
  getCreatedAtFilter,
  getOrder,
  getSearchTextFilter,
  getTagFilter,
  TagFilter,
  tagsToJSON,
} from './model';

// const t: null | number = null;
// export const tt: number = t; // FTW?

export const makeRouter = (sequelize: Sequelize) => {
  const NewsModel = createNewsModel(sequelize);
  const AuthorModel = createAuthorModel(sequelize);
  const router = express.Router();
  router.use(createLogger(module));

  router.get('/raw/', authenticateAdmin, async (req, res, next) => {
    try {
      const { limit, offset } = (req.query as unknown) as Pagination;
      const news = await NewsModel.findAll({
        limit,
        offset,
        attributes: newsAttributes,
      });
      res.json(news.map(getNewsFromInstance));
    } catch (error) {
      next(error);
    }
  });

  router.get('/my-drafts/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const { limit, offset } = (req.query as unknown) as Pagination;
      const news = await NewsModel.findAll({
        limit,
        offset,
        attributes: newsAttributes,
        where: {
          authorId: user.id,
          isDraft: true,
        },
      });
      res.json(news.map(getNewsFromInstance));
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const { limit, offset } = (req.query as unknown) as Pagination;
      const {
        categoryId,
        title,
        content,
        authorName,
        searchText,
      } = (req.query as unknown) as Filters;
      const order = getOrder(((req.query as unknown) as { order: NewsOrder }).order);

      const filters = [
        'n."isDraft" = false',
        getTagFilter((req.query as unknown) as TagFilter),
        getCreatedAtFilter((req.query as unknown) as CreatedAtFilter),
        getSearchTextFilter(searchText),
        authorName ? `'${authorName}' = u."firstName"` : null,
        categoryId ? `${categoryId} = n."categoryId"` : null,
        title ? `n.title LIKE '%${title}%'` : null,
        content ? `n.content LIKE '%${content}%'` : null,
      ]
        .filter(f => f !== null)
        .join(' AND ');

      const fullNews = await sequelize.query(
        `
          SELECT n.id, (${authorToJSON}) as author, ARRAY(${categoryToJSON}) as category, ARRAY(${tagsToJSON}) as tags,
            n."createdAt", n.title, n.content, n."topPhotoLink", n."photoLinks", n."isDraft"
          FROM "News" as n
          JOIN "Authors" as a ON a.id = n."authorId"
          JOIN "Users" as u ON a.id = u.id
          JOIN "Categories" as c ON c.id = n."categoryId"
          WHERE ${filters}
          ORDER ${order}
          LIMIT ${limit}
          OFFSET ${offset}
          `,
        {
          nest: true,
          type: QueryTypes.SELECT,
        },
      );
      res.json(fullNews);
    } catch (error) {
      next(error);
    }
  });
  router.get('/:id', async (req, res, next) => {
    try {
      const news = await NewsModel.findOne({
        where: { id: req.params.id },
        attributes: newsAttributes,
      });
      if (!news) {
        return res.status(404).send();
      }
      res.json(getNewsFromInstance(news));
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
