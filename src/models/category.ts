import { Sequelize, Model, DataTypes } from 'sequelize';
import { Category, CreateCategory } from 'src/types/generated';

interface CategoryInstance extends Model<Category, CreateCategory>, Category {}

export const createCategoryModel = (sequalize: Sequelize) =>
  sequalize.define<CategoryInstance>('Category', {
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
    label: 'politics',
  },
  {
    parentCategoryId: null,
    label: 'business',
  },
  {
    parentCategoryId: null,
    label: 'health',
  },
  {
    parentCategoryId: null,
    label: 'sports',
  },
  {
    parentCategoryId: 4,
    label: 'auto sport',
  },
  {
    parentCategoryId: 5,
    label: 'Formula 1',
  },
  {
    parentCategoryId: 5,
    label: 'Rally sport',
  },
];

export const initCategoryData = async (sequelize: Sequelize) => {
  const CategoryModel = createCategoryModel(sequelize);
  // await CategoryModel.drop();
  await CategoryModel.sync({ force: true });
  const promises = initialCategories.map(async data => {
    await CategoryModel.create(data);
  });
  return Promise.all(promises);
};
