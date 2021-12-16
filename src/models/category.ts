import { Sequelize, Model, DataTypes } from 'sequelize';
import { Category, CreateCategory } from 'src/types/generated';

import { ModelsStore } from './models.store';

export interface CategoryInstance extends Model<Category, CreateCategory>, Category {}

export const createCategoryModel = <T extends CategoryInstance>(sequalize: Sequelize) =>
  sequalize.define<T, Category>('Category', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parentCategoryId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });
/**
 * Category omit virtual attributes
 */
export const getCategoryFromInstance = ({
  label,
  id,
  parentCategoryId,
}: CategoryInstance): Category => ({
  label,
  id,
  parentCategoryId,
});

export const initialCategories: CreateCategory[] = [
  {
    parentCategoryId: null,
    label: 'Новость',
  },
  {
    parentCategoryId: null, // 2
    label: 'Политика',
  },
  {
    parentCategoryId: null,
    label: 'Бизнес',
  },
  {
    parentCategoryId: null, // 4
    label: 'Здоровье',
  },
  {
    parentCategoryId: null,
    label: 'Спорт',
  },
  {
    parentCategoryId: 5, // 6
    label: 'Авто спорт',
  },
  {
    parentCategoryId: 6,
    label: 'Формула 1',
  },
  {
    parentCategoryId: 6, // 8
    label: 'Ралли спорт',
  },
];

export const initCategoryData = async (sequelize: Sequelize, { CategoryModel }: ModelsStore) => {
  await CategoryModel.sync({ force: true });
  const promises = initialCategories.map(async data => {
    await CategoryModel.create(data);
  });
  return Promise.all(promises);
};
