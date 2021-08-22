/* eslint-disable no-console */
import { Sequelize } from 'sequelize';

import { createCategoryModel } from '../src/models/category';
import { createUserModel } from '../src/models/user';
import { createAuthorModel } from '../src/models/author';
import { createNewsModel } from '../src/models/news';
import { createCommentModel } from '../src/models/comments';
import { createTagModel } from '../src/models/tags';
import { getConfig } from '../src/config';

const script = async () => {
  console.log('db sync models script started');
  const config = getConfig();
  const sequelize = new Sequelize(config.DB_NAME, 'postgres', config.DB_PASS, {
    host: 'localhost',
    dialect: 'postgres',
  });
  const modelCreators = [
    createCategoryModel,
    createUserModel,
    createAuthorModel,
    createNewsModel,
    createCommentModel,
    createTagModel,
  ];
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return;
  }
  try {
    const models = modelCreators.map(creator => creator(sequelize));
    const promises = models.map(m => m.sync({ alter: true }));
    const res = await Promise.all(promises);
    // await sequelize.sync({ alter: true }); todo use
    console.log('script completed', res);
  } catch (error) {
    console.error('sync error', error);
  }
};

script();
