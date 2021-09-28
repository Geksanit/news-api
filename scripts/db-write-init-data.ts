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
import { log } from '../src/libs/log';

const script = async () => {
  log.info('db write initial data started');
  const config = getConfig();
  const sequelize = new Sequelize(config.DB_NAME, 'postgres', config.DB_PASS, {
    host: 'localhost',
    dialect: 'postgres',
  });
  try {
    await sequelize.authenticate();
    log.info('Connection has been established successfully.');
  } catch (error) {
    log.error('Unable to connect to the database:', error);
    return;
  }
  try {
    const store = createModelsStore(sequelize);
    const {
      AuthorModel,
      UserModel,
      NewsModel,
      NewsDraftModel,
      CommentModel,
      TagModel,
      CategoryModel,
      NewsDraftTagModel,
      NewsTagModel,
    } = store;

    await CommentModel.drop();
    await NewsTagModel.drop();
    await NewsDraftTagModel.drop();
    await NewsModel.drop();
    await NewsDraftModel.drop();
    await AuthorModel.drop();
    await UserModel.drop();
    await CategoryModel.drop();
    await TagModel.drop();

    await initTagData(sequelize, store);
    await initCategoryData(sequelize, store);
    await initUserData(sequelize, store);
    await initAuthorData(sequelize, store);
    await initNewsData(sequelize, store);
    await initCommentData(sequelize, store);

    log.info('script completed successfully');
  } catch (error) {
    log.error('script error', error);
  }
};

script();
