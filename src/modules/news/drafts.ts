/* eslint-disable @typescript-eslint/naming-convention */
import express from 'express';
import { Sequelize, QueryTypes } from 'sequelize';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { createNewsToModel, getNewsFromInstance, newsAttributes } from '../../models/news';
import { authenticateAdmin, authenticateUser } from '../../middlewares/authenticate';
import { CreateNews, News, Pagination, UserView } from '../../types/generated';
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
import { ModelsStore } from '../../models/models.store';

export const makeRouter = (sequelize: Sequelize, modelsStore: ModelsStore) => {
  const { AuthorModel, DraftModel } = modelsStore;
  const router = express.Router();
  router.use(createLogger(module));

  router.get('/full/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const author = await AuthorModel.findOne({
        where: { id: user.id },
      });
      if (!author) {
        throw new HttpError(400, 'author not found');
      }
      const { limit, offset } = (req.query as unknown) as Pagination;
      const { categoryId, title, content, searchText } = (req.query as unknown) as Filters;
      const { tag, tags__in, tags__all } = (req.query as unknown) as TagFilter;
      const {
        created_at,
        created_at__lt,
        created_at__gt,
      } = (req.query as unknown) as CreatedAtFilter;
      const stringifiedOrder = getOrder(req.query);
      const stringifiedFilters = [
        `:authorId = n."authorId"`,
        getTagFilter({ tag, tags__in, tags__all }, true),
        getCreatedAtFilter({ created_at, created_at__lt, created_at__gt }),
        getSearchTextFilter(searchText, true),
        categoryId ? `:categoryId = n."categoryId"` : null,
        title ? `n.title LIKE :title` : null,
        content ? `n.content LIKE :content` : null,
      ]
        .filter(f => f !== null)
        .join(' AND ');
      const fullNews = await sequelize.query(
        `
          SELECT n.id, (${authorToJSON}) as author, ARRAY(${categoryToJSON}) as category, ARRAY(${tagsToJSON(
          true,
        )}) as tags,
            n."createdAt", n.title, n.content, n."topPhotoLink", n."photoLinks"
          FROM "Drafts" as n
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
            authorId: author?.id,
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

  router.get('/publish/:id', authenticateAdmin, async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req;
      const draft = await DraftModel.findOne({
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

  router.get('/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const { limit, offset } = (req.query as unknown) as Pagination;
      const news = await DraftModel.findAll({
        limit,
        offset,
        attributes: newsAttributes,
        where: {
          authorId: user.id,
        },
        order: sequelize.Sequelize.col('id'),
      });
      res.json(news.map(getNewsFromInstance));
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
      const instance = await DraftModel.create(createNewsToModel({ ...news, authorId: user.id }));
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
      const news = await DraftModel.findOne({ where: { id: updatedNews } });
      if (!news || user.id !== news.authorId) {
        throw new HttpError(400, 'not found draft');
      }
      await DraftModel.update(req.body, { where: { id: req.body.id } });
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
      const draft = await DraftModel.findOne({
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

  router.get('/full/:id', async (req, res, next) => {
    try {
      const arr = await sequelize.query(
        `
          SELECT n.id, (${authorToJSON}) as author, ARRAY(${categoryToJSON}) as category, ARRAY(${tagsToJSON(
          true,
        )}) as tags,
            n."createdAt", n.title, n.content, n."topPhotoLink", n."photoLinks"
          FROM "Drafts" as n
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
      const fullDraft = arr[0];
      if (!fullDraft) {
        return res.status(404).send();
      }
      res.json(fullDraft);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const news = await DraftModel.findOne({
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
