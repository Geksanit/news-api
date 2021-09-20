/* eslint-disable no-console */
import { Sequelize } from 'sequelize';

import { initCategoryData } from '../src/models/category';
import { initUserData } from '../src/models/user';
import { initAuthorData } from '../src/models/author';
import { initCommentData } from '../src/models/comments';
import { initNewsData } from '../src/models/news';
import { initTagData } from '../src/models/tags';
import { getConfig } from '../src/config';
import { createModelsStore } from '../src/models/models.store';

const script = async () => {
  console.log('db initial data started');
  const config = getConfig();
  const sequelize = new Sequelize(config.DB_NAME, 'postgres', config.DB_PASS, {
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
    const store = createModelsStore(sequelize);
    const userTask = async (seq: Sequelize) => {
      await initUserData(seq, store, true);
      await initAuthorData(seq, store);
    };
    const tasks = [initCategoryData, userTask, initTagData, initCommentData, initNewsData];
    const promises: Promise<any>[] = tasks.map(task => task(sequelize, store, true));
    await Promise.all(promises);

    console.log('script completed');
  } catch (error) {
    console.error('create error', error);
  }
};

script();
