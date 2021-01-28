import { Sequelize } from 'sequelize';

import { createUserModel } from './models/user';

// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

const sequelize = new Sequelize('newdatabase', 'postgres', '***', {
  // TODO change pass
  host: 'localhost',
  dialect: 'postgres' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

export const test = async () => {
  try {
    console.log('test start');
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const User = createUserModel(sequelize);
    User.sync();
    const jane = await User.create({
      firstName: 'Jane',
      lastName: 'Snow',
      username: 'janes2',
      id: 1,
    });
    console.log('complete save', jane.firstName);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
