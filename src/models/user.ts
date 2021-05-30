import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { User, CreateUser } from 'src/types/generated';
import * as R from 'ramda';

interface UserCreationAttributes extends Optional<User, 'id'> {}

interface UserInstance extends Model<User, UserCreationAttributes>, User {}

export const createUserModel = (sequalize: Sequelize) =>
  sequalize.define<UserInstance>('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    passwordHash: {
      type: DataTypes.STRING,
    },
    avatarUrl: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
    },
  });
export const attributes: Array<keyof User> = [
  'id',
  'login',
  'firstName',
  'lastName',
  // 'passwordHash',
  'avatarUrl',
  'isAdmin',
];
/**
 * User omit virtual attributes
 */
export const getUserFromInstance = (instance: UserInstance): User =>
  R.pick<keyof User>(attributes)(instance);

export const initialCategories: CreateUser[] = [
  {
    login: 'userLogin',
    firstName: 'Joe',
    lastName: 'Nep',
    passwordHash: '123',
    avatarUrl: '123',
    isAdmin: false,
  },
  {
    login: 'darkL0rd',
    firstName: 'Tolik',
    lastName: 'Tipupkin',
    passwordHash: '123',
    avatarUrl: '123',
    isAdmin: true,
  },
  {
    login: 'aaa111',
    firstName: 'Dmitriy',
    lastName: 'Morozov',
    passwordHash: 'qwerty12345',
    avatarUrl: '',
    isAdmin: false,
  },
];

export const initUserData = async (sequelize: Sequelize) => {
  const model = createUserModel(sequelize);
  // await UserModel.drop();
  await model.sync({ force: true });
  const promises = initialCategories.map(data => model.create(data));
  return Promise.all(promises);
};
