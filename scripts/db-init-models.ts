import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();
import { createCategoryModel } from '../src/models/category';

const script = async () => {
  console.log('db init models script started');
  const sequelize = new Sequelize(process.env.DB_NAME, 'postgres', process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'postgres',
  });
  const modelCreators = [createCategoryModel];
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return;
  }
  try {
    const models = modelCreators.map(creator => creator(sequelize));
    const promises = models.map(m => m.sync());
    const res = await Promise.all(promises);
    console.log('script completed', res);
  } catch (error) {
    console.error('sync error', error);
  }
};

script();
