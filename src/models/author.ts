import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { Author, CreateAuthor } from 'src/types/generated';
import * as R from 'ramda';

interface AuthorCreationAttributes extends Optional<Author, 'id'> {}

interface AuthorInstance extends Model<Author, AuthorCreationAttributes>, Author {}

export const createAuthorModel = (sequalize: Sequelize) =>
  sequalize.define<AuthorInstance>('Author', {
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

export const initAuthorData = async (sequelize: Sequelize) => {
  const model = createAuthorModel(sequelize);
  // await AuthorModel.drop();
  await model.sync({ force: true });
  const promises = initialCategories.map(async data => {
    await model.create(data);
  });
  return Promise.all(promises);
};
