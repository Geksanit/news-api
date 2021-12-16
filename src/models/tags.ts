import { Sequelize, Model, DataTypes } from 'sequelize';
import { Tag, CreateTag } from 'src/types/generated';

import { ModelsStore } from './models.store';

export interface TagInstance extends Model<Tag, CreateTag>, Tag {}

export const createTagModel = (sequalize: Sequelize) =>
  sequalize.define<TagInstance>('Tag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });
/**
 * Tag omit virtual attributes
 */
export const getTagFromInstance = ({ label, id }: TagInstance): Tag => ({
  label,
  id,
});

export const initialTags: CreateTag[] = [
  {
    label: 'технологии',
  },
  {
    label: 'происшествие', // 2
  },
  {
    label: 'мемы',
  },
  {
    label: 'транспорт', // 4
  },
  {
    label: 'репост',
  },
  {
    label: 'маркетинг', // 6
  },
  {
    label: 'будущее',
  },
  {
    label: 'рассказы', // 8
  },
  {
    label: 'интервью',
  },
  {
    label: 'перевод', // 10
  },
];

export const initTagData = async (sequelize: Sequelize, { TagModel }: ModelsStore) => {
  await TagModel.sync({ force: true });
  const promises = initialTags.map(async data => {
    await TagModel.create(data);
  });
  return Promise.all(promises);
};
