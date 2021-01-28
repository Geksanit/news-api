import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
};

interface UserCreationAttributes extends Optional<User, 'id'> {}

interface UserInstance extends Model<User, UserCreationAttributes>, User {}

export const createUserModel = (sequalize: Sequelize) =>
  sequalize.define<UserInstance>('User', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
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
  });
