/* eslint-disable no-console */
/* eslint-disable import/first */
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

import { initCategoryData } from '../src/models/category';
import { initUserData } from '../src/models/user';
import { initAuthorData } from '../src/models/author';

const script = async () => {
  console.log('db initial data started');
  const sequelize = new Sequelize(process.env.DB_NAME, 'postgres', process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'postgres',
  });
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return;
  }
  try {
    const userTask = async (seq: Sequelize) => {
      await initUserData(seq);
      return initAuthorData(seq);
    };
    const tasks = [initCategoryData, userTask];
    const promises: Promise<any>[] = tasks.map(task => task(sequelize));
    const res = await Promise.all(promises);

    console.log('script completed', res);
  } catch (error) {
    console.error('create error', error);
  }
};

script();
