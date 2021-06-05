import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { UserModel, UserView, CreateUser } from 'src/types/generated';
import * as R from 'ramda';

import { getHash } from '../libs/passwordHash';

interface UserCreationAttributes extends Optional<UserModel, 'id'> {}

interface UserInstance extends Model<UserModel, UserCreationAttributes>, UserModel {}

export const createUserModel = (sequalize: Sequelize) =>
  sequalize.define<UserInstance>('User', {
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

export const createUserToModel = async ({
  password,
  ...rest
}: CreateUser): Promise<Omit<UserModel, 'id'>> => {
  const passwordHash = await getHash(password);
  return {
    ...rest,
    passwordHash,
    isAdmin: false,
    tokenCounter: 0,
  };
};

export const initialCategories: Array<CreateUser & { isAdmin: boolean }> = [
  {
    username: 'userLogin',
    firstName: 'Joe',
    lastName: 'Nep',
    password: '123',
    avatarUrl: '123',
    isAdmin: false,
  },
  {
    username: 'darkL0rd',
    firstName: 'Tolik',
    lastName: 'Tipupkin',
    password: '123',
    avatarUrl: '123',
    isAdmin: true,
  },
  {
    username: 'aaa111',
    firstName: 'Dmitriy',
    lastName: 'Morozov',
    password: 'qwerty12345',
    avatarUrl: '',
    isAdmin: false,
  },
];

export const initUserData = async (sequelize: Sequelize, isDropTable: boolean) => {
  const model = createUserModel(sequelize);
  if (isDropTable) {
    await model.drop();
  }
  await model.sync({ force: true });
  const promises = initialCategories.map(async data => {
    const userModel = await createUserToModel(data);
    await model.create({ ...userModel, isAdmin: data.isAdmin });
  });
  return Promise.all(promises);
};
