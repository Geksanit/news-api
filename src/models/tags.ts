import { Sequelize, Model, DataTypes } from 'sequelize';
import { Tag, CreateTag } from 'src/types/generated';

interface TagInstance extends Model<Tag, CreateTag>, Tag {}

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
    label: 'politics',
  },
  {
    label: 'business',
  },
  {
    label: 'memes',
  },
  {
    label: 'new',
  },
  {
    label: 'repost',
  },
  {
    label: 'football',
  },
  {
    label: 'media',
  },
  {
    label: 'F1',
  },
  {
    label: 'auto',
  },
];

export const initTagData = async (sequelize: Sequelize) => {
  const TagModel = createTagModel(sequelize);
  // await TagModel.drop();
  await TagModel.sync({ force: true });
  const promises = initialTags.map(async data => {
    await TagModel.create(data);
  });
  return Promise.all(promises);
};
