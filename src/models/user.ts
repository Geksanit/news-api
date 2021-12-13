import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { UserModel, UserView, CreateUser } from 'src/types/generated';
import * as R from 'ramda';

import { getHash } from '../libs/passwordHash';
import { ModelsStore } from './models.store';

export interface UserCreationAttributes extends Optional<UserModel, 'id'> {}

export interface UserInstance extends Model<UserModel, UserCreationAttributes>, UserModel {}

export const createUserModel = <T extends UserInstance>(sequalize: Sequelize) =>
  sequalize.define<T, UserCreationAttributes>('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
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
    tokenCounter: {
      type: DataTypes.INTEGER,
    },
  });
export const userViewAttributes: Array<keyof UserView> = [
  'id',
  'username',
  'firstName',
  'lastName',
  'avatarUrl',
  'isAdmin',
];
/**
 * User omit virtual attributes
 */
export const getUserViewFromInstance = (instance: UserInstance): UserView =>
  R.pick<keyof UserView>(userViewAttributes)(instance);

export const createUserToModel = ({ password, ...rest }: CreateUser): Omit<UserModel, 'id'> => ({
  ...rest,
  passwordHash: getHash(password),
  isAdmin: false,
  tokenCounter: 0,
});

export const initialCategories: Array<CreateUser & { isAdmin: boolean }> = [
  {
    username: 'firstUser',
    firstName: 'Иван',
    lastName: 'Иванов',
    password: '123',
    avatarUrl: '123',
    isAdmin: false,
  },
  {
    username: 'adminLogin',
    firstName: 'Толик',
    lastName: 'Типупкин',
    password: '123',
    avatarUrl: '123',
    isAdmin: true,
  },
  {
    username: 'seconUser',
    firstName: 'Дмитрий',
    lastName: 'Морозов',
    password: 'qwerty12345',
    avatarUrl: '',
    isAdmin: false,
  },
  {
    username: 'thirdUser',
    firstName: 'Олег',
    lastName: 'Кузнецов',
    password: 'qwerty12345',
    avatarUrl: '',
    isAdmin: false,
  },
];

export const initUserData = async (sequelize: Sequelize, { UserModel: UModel }: ModelsStore) => {
  await UModel.sync({ force: true });
  const promises = initialCategories.map(async data => {
    await UModel.create({ ...createUserToModel(data), isAdmin: data.isAdmin });
  });
  return Promise.all(promises);
};
