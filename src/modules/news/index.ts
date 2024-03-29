/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import { Sequelize, QueryTypes } from 'sequelize';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { getNewsFromInstance, newsAttributes } from '../../models/news';
import { authenticateAdmin } from '../../middlewares/authenticate';
import { Pagination } from '../../types/generated';
import {
  authorToJSON,
  categoryToJSON,
  CreatedAtFilter,
  Filters,
  getCreatedAtFilter,
  getOrder,
  getSearchTextFilter,
  getTagFilter,
  tagsToJSON,
  TagFilter,
} from './model';
import { ModelsStore } from '../../models/models.store';

export const makeRouter = (sequelize: Sequelize, modelsStore: ModelsStore) => {
  const { NewsModel } = modelsStore;
  const router = express.Router();
  router.use(createLogger(module));

  router.get('/full/', async (req, res, next) => {
    try {
      const { limit, offset } = (req.query as unknown) as Pagination;
      const {
        categoryId,
        title,
        content,
        authorName,
        searchText,
      } = (req.query as unknown) as Filters;
      const { tag, tags__in, tags__all } = (req.query as unknown) as TagFilter;
      const {
        created_at,
        created_at__lt,
        created_at__gt,
      } = (req.query as unknown) as CreatedAtFilter;
      const stringifiedOrder = getOrder(req.query);
      const stringifiedFilters = [
        'True',
        getTagFilter({ tag, tags__in, tags__all }, false),
        getCreatedAtFilter({ created_at, created_at__lt, created_at__gt }),
        getSearchTextFilter(searchText, false),
        authorName ? `:authorName = u."firstName"` : null,
        categoryId ? `:categoryId = n."categoryId"` : null,
        title ? `n.title LIKE :title` : null,
        content ? `n.content LIKE :content` : null,
      ]
        .filter(f => f !== null)
        .join(' AND ');
      const fullNews = await sequelize.query(
        `
          SELECT n.id, (${authorToJSON}) as author, ARRAY(${categoryToJSON}) as category, ARRAY(${tagsToJSON(
          false,
        )}) as tags,
            n."createdAt", n.title, n.content, n."topPhotoLink", n."photoLinks"
          FROM "News" as n
          JOIN "Authors" as a ON a.id = n."authorId"
          JOIN "Users" as u ON a.id = u.id
          JOIN "Categories" as c ON c.id = n."categoryId"
          WHERE ${stringifiedFilters}
          ORDER ${stringifiedOrder}
          LIMIT :limit
          OFFSET :offset
          `,
        {
          replacements: {
            limit,
            offset,
            authorName,
            categoryId,
            title: `%${title}%`,
            content: `%${content}%`,
            tag,
            tags__in,
            tags__all,
            created_at,
            created_at__lt,
            created_at__gt,
            searchText,
            searchTextLike: `%${searchText}%`,
          },
          nest: true,
          type: QueryTypes.SELECT,
        },
      );
      res.json(fullNews);
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const { limit, offset } = (req.query as unknown) as Pagination;
      const news = await NewsModel.findAll({
        limit,
        offset,
        attributes: newsAttributes,
        order: sequelize.Sequelize.col('id'),
      });
      res.json(news.map(getNewsFromInstance));
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

      await news.destroy();
      res.send('deleted');
    } catch (error) {
      next(error);
    }
  });

  router.get('/full/:id', async (req, res, next) => {
    try {
      const arr = await sequelize.query(
        `
          SELECT n.id, (${authorToJSON}) as author, ARRAY(${categoryToJSON}) as category, ARRAY(${tagsToJSON(
          false,
        )}) as tags,
            n."createdAt", n.title, n.content, n."topPhotoLink", n."photoLinks"
          FROM "News" as n
          JOIN "Authors" as a ON a.id = n."authorId"
          JOIN "Users" as u ON a.id = u.id
          JOIN "Categories" as c ON c.id = n."categoryId"
          WHERE n.id = :id
        `,
        {
          replacements: {
            id: req.params.id,
          },
          nest: true,
          type: QueryTypes.SELECT,
        },
      );
      const fullNews = arr[0];
      if (!fullNews) {
        return res.status(404).send();
      }
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

  return router;
};
