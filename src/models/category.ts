import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

export type CategoryType = 'politics' | 'business' | 'health' | 'sports';
// enum categ {
//   'politics',
//   'business',
//   'health',
//   'sports',
// }
export type Category = {
  id: number;
  label: CategoryType;
};

interface CategoryCreationAttributes extends Optional<Category, 'id'> {}

interface CategoryInstance extends Model<Category, CategoryCreationAttributes>, Category {}

export const createCategoryModel = (sequalize: Sequelize) =>
  sequalize.define<CategoryInstance>('Category', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    label: {
      type: DataTypes.ENUM('politics', 'business', 'health', 'sports'),
    },
  });
