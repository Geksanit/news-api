import { Sequelize } from 'sequelize';

import { createUserModel } from './models/user';

const sequelize = new Sequelize(process.env.DB_NAME, 'postgres', process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'postgres',
});

export const test = async () => {
  try {
    console.log('test start');
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const User = createUserModel(sequelize);
    User.sync();
    // const jane = await User.create({
    //   firstName: 'Jane',
    //   lastName: 'Snow',
    //   username: 'janes2',
    //   id: 1,
    // });
    // console.log('complete save', jane.firstName);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
