import express from 'express';
import { Sequelize } from 'sequelize/types';

import { HttpError } from '../../utils/Errors';
import { createLogger } from '../../middlewares/logger';
import { createCommentModel, getCommentFromInstance } from '../../models/comments';
import { authenticateAdmin, authenticateUser } from '../../middlewares/authenticate';
import { createNewsModel } from '../../models/news';
import { CreateComment, UserView, Comment } from '../../types/generated';

export const makeRouter = (sequelize: Sequelize) => {
  const CommentModel = createCommentModel(sequelize);
  const NewsModel = createNewsModel(sequelize);
  const router = express.Router();
  router.use(createLogger(module));

  router.get('/', authenticateAdmin, async (req, res, next) => {
    try {
      const comments = await CommentModel.findAll({
        attributes: ['content', 'userId', 'newsId', 'id', 'createdAt'],
      });
      res.json(comments);
    } catch (error) {
      next(error);
    }
  });
  router.post('/', authenticateUser, async (req, res, next) => {
    try {
      const newComment = req.body as CreateComment;
      const news = await NewsModel.findOne({ where: { id: newComment.newsId } });
      if (!news) {
        throw new HttpError(400, 'not found news');
      }
      const instance = await CommentModel.create({
        ...newComment,
        userId: (req.user as UserView).id,
      });
      res.status(201).send(getCommentFromInstance(instance));
    } catch (error) {
      next(error);
    }
  });
  router.patch('/', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const newComment = req.body as Comment;
      const comment = await CommentModel.findOne({ where: { id: newComment.id } });
      if (!comment || comment.userId !== user.id) {
        throw new HttpError(400, 'not found comment');
      }
      await CommentModel.update({ content: newComment.content }, { where: { id: req.body.id } });
      res.send('updated');
    } catch (error) {
      next(error);
    }
  });
  router.delete('/:id', authenticateUser, async (req, res, next) => {
    try {
      const user = req.user as UserView;
      const {
        params: { id },
      } = req;
      const comment = await CommentModel.findOne({
        where: { id },
      });
      if (!comment || comment.userId !== user.id) {
        throw new HttpError(400, 'not found comment');
      }
      await CommentModel.destroy({
        where: { id },
      });
      res.send('deleted');
    } catch (error) {
      next(error);
    }
  });

  return router;
};
