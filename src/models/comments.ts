import { pick } from 'ramda';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Comment, CreateComment } from 'src/types/generated';

import { ModelsStore } from './models.store';

export interface CommentInstance
  extends Model<Comment, CreateComment & { userId: number }>,
    Comment {}

export const createCommentModel = <T extends CommentInstance>(sequalize: Sequelize) =>
  sequalize.define<T, Comment>('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    newsId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

export const getCommentFromInstance = (instance: CommentInstance): Comment =>
  pick<keyof Comment>(['content', 'userId', 'newsId', 'id', 'createdAt'])(instance);

export const initialCategories: Array<CreateComment & { userId: number }> = [
  {
    newsId: 1,
    userId: 1,
    content: 'comment text 1',
  },
  {
    newsId: 1,
    userId: 2,
    content: 'comment text 2',
  },
];

export const initCommentData = async (sequelize: Sequelize, { CommentModel }: ModelsStore) => {
  await CommentModel.sync({ force: true });
  const promises = initialCategories.map(async data => {
    await CommentModel.create(data);
  });
  return Promise.all(promises);
};
