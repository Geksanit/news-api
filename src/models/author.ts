import { Sequelize, Model, DataTypes } from 'sequelize';
import { Author, CreateAuthor } from 'src/types/generated';
import * as R from 'ramda';

import { ModelsStore } from './models.store';

export interface AuthorInstance extends Model<Author, CreateAuthor>, Author {}

export const createAuthorModel = <T extends AuthorInstance>(sequalize: Sequelize) =>
  sequalize.define<T, Author>('Author', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  });

export const attributes: Array<keyof Author> = ['id', 'userId', 'description'];
/**
 * Author omit virtual attributes
 */
export const getAuthorFromInstance = (instance: AuthorInstance): Author =>
  R.pick<keyof Author>(attributes)(instance);

export const initialCategories: CreateAuthor[] = [
  {
    userId: 1,
    description: 'First author on site',
  },
  {
    userId: 2,
    description: 'Second author on site',
  },
];

export const initAuthorData = async (sequelize: Sequelize, { AuthorModel }: ModelsStore) => {
  await AuthorModel.sync({ force: true });
  const promises = initialCategories.map(async data => {
    await AuthorModel.create(data);
  });
  return Promise.all(promises);
};
