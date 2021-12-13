/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import { Sequelize, QueryTypes } from 'sequelize';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { createNewsToModel, getNewsFromInstance, newsAttributes } from '../../models/news';
import { authenticateAdmin, authenticateUser } from '../../middlewares/authenticate';
import { CreateNews, News, NewsOrder, Pagination, UserView } from '../../types/generated';
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
  const { NewsModel, AuthorModel, NewsDraftModel } = modelsStore;
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
      const { tag, tags__in, tags__all } = (req.query as unknown) as TagFilter;
      const {
        created_at,
        created_at__lt,
        created_at__gt,
      } = (req.query as unknown) as CreatedAtFilter;
      const { order } = (req.query as unknown) as { order: NewsOrder };
      const stringifiedOrder = getOrder(order);
      const stringifiedFilters = [
        'True',
        getTagFilter({ tag, tags__in, tags__all }),
        getCreatedAtFilter({ created_at, created_at__lt, created_at__gt }),
        getSearchTextFilter(searchText),
        authorName ? `:authorName = u."firstName"` : null,
        categoryId ? `:categoryId = n."categoryId"` : null,
        title ? `n.title LIKE :title` : null,
        content ? `n.content LIKE :content` : null,
      ]
        .filter(f => f !== null)
        .join(' AND ');
      const fullNews = await sequelize.query(
        `
          SELECT n.id, (${authorToJSON}) as author, (${categoryToJSON}) as category, ARRAY(${tagsToJSON}) as tags,
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

  router.get('/drafts/publish/:id', authenticateAdmin, async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req;
      const draft = await NewsDraftModel.findOne({
        where: { id },
      });
      if (!draft) {
        throw new HttpError(400, 'not found draft');
      }
      const tags = await draft.getTags();
      const news = await draft.getNews();
      if (news) {
        await news.update(getNewsFromInstance(draft));
        const oldTags = await news.getTags();
        await news.removeTags(oldTags);
        await news.addTags(tags);
      } else {
        const newNews = await draft.createNews(getNewsFromInstance(draft));
        await newNews.addTags(tags);
      }
      res.status(201);
    } catch (error) {
      next(error);
    }
  });

  router.get('/drafts/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const { limit, offset } = (req.query as unknown) as Pagination;
      const news = await NewsDraftModel.findAll({
        limit,
        offset,
        attributes: newsAttributes,
        where: {
          authorId: user.id,
        },
      });
      res.json(news.map(getNewsFromInstance));
    } catch (error) {
      next(error);
    }
  });
  router.post('/drafts/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const news = req.body as CreateNews;
      const author = await AuthorModel.findOne({ where: { userId: user.id } });
      if (!author) {
        throw new HttpError(400, 'user is not author');
      }
      const instance = await NewsDraftModel.create(
        createNewsToModel({ ...news, authorId: user.id }),
      );
      res.status(201).send(getNewsFromInstance(instance));
    } catch (error) {
      next(error);
    }
  });
  router.patch('/drafts/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const updatedNews = req.body as News;
      const author = await AuthorModel.findOne({ where: { userId: user.id } });
      if (!author) {
        throw new HttpError(400, 'user is not author');
      }
      const news = await NewsDraftModel.findOne({ where: { id: updatedNews } });
      if (!news || user.id !== news.authorId) {
        throw new HttpError(400, 'not found news');
      }
      await NewsModel.update(req.body, { where: { id: req.body.id } });
      res.send('updated');
    } catch (error) {
      next(error);
    }
  });
  router.delete('/drafts/:id', authenticateAdmin, async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req;
      const draft = await NewsDraftModel.findOne({
        where: { id },
      });
      if (!draft) {
        throw new HttpError(400, 'not found draft');
      }
      const news = await draft.getNews();
      if (news) {
        await news.destroy();
      }
      await draft.destroy();
      res.send('deleted');
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
