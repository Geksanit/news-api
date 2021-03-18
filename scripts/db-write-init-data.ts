import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();
import { createCategoryModel, initialCategories } from '../src/models/category';

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
    const CategoryModel = createCategoryModel(sequelize);
    // await CategoryModel.drop();
    await CategoryModel.sync({ force: true });
    const promises = initialCategories.map(data => CategoryModel.create(data));

    const res = await Promise.all(promises);
    console.log('script completed', res);
  } catch (error) {
    console.error('create error', error);
  }
};

script();
