import { pick } from 'ramda';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { News, CreateNews } from 'src/types/generated';

interface NewsInstance extends Model<News, CreateNews & { authorId: number }>, News {}

export const createNewsModel = (sequalize: Sequelize) =>
  sequalize.define<NewsInstance>('News', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    authorId: {
      type: DataTypes.INTEGER,
    },
    categoryId: {
      type: DataTypes.INTEGER,
    },
    tagsIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    content: {
      type: DataTypes.TEXT,
    },
    topPhotoLink: {
      type: DataTypes.STRING,
    },
    photoLinks: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    isDraft: {
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
  });

export const getNewsFromInstance = (instance: NewsInstance): News =>
  pick<keyof News>([
    'id',
    'title',
    'authorId',
    'categoryId',
    'tagsIds',
    'content',
    'createdAt',
    'topPhotoLink',
    'photoLinks',
    'isDraft',
  ])(instance);

export const createNewsToModel = ({
  ...rest
}: CreateNews & { authorId: number }): Omit<News, 'id'> => {
  return {
    ...rest,
    createdAt: new Date(Date.now()).toISOString(),
  };
};

export const initialCategories: Array<CreateNews & { authorId: number }> = [
  {
    title: 'Truck carrying tomato puree crashes, turning road red',
    categoryId: 0,
    tagsIds: [0, 1],
    content: `A truck laden with tomato puree crashed in England this week, turning a highway red and prompting a number of food-related puns from people on social media.
    The vehicle was involved in a crash with another truck in Cambridgeshire, eastern England, on Tuesday, Highways England told CNN.
    The government highways authority said the vehicle "lost its load and damaged the carriageway," leading to a road closure on the A14.
    One driver sustained a "minor" injury, Highways England said.
    A spokesman confirmed it was carrying tomato puree, which spilled across the road and prompted emergency road resurfacing overnight until Wednesday afternoon.`,
    topPhotoLink:
      'https://cdn.cnn.com/cnnnext/dam/assets/210603052531-restricted-england-crash-tomato-puree-0602-exlarge-169.jpg',
    photoLinks: [''],
    isDraft: false,
    authorId: 0,
  },
  {
    title: 'New Zealand is a Five Eyes outlier on China. It may have to pick a side',
    categoryId: 0,
    tagsIds: [0, 1],
    content: `"Could it be that New Zealand is turning into ... New Xi Land?" questioned an ominous voice over.
    It was part of a preview for an incendiary segment of Australian TV show "60 Minutes" premised on the idea that New Zealand is so desperate to keep China, its biggest trading partner, onside that it has cast aside both its morals and its friendship with Canberra.`,
    topPhotoLink:
      'https://cdn.cnn.com/cnnnext/dam/assets/210602221801-05-new-zealand-xinjiang-china-intl-hnk-exlarge-169.jpg',
    photoLinks: [''],
    isDraft: true,
    authorId: 1,
  },
];

export const initNewsData = async (sequelize: Sequelize) => {
  const NewsModel = createNewsModel(sequelize);
  // await NewsModel.drop();
  await NewsModel.sync({ force: true });
  const promises = initialCategories.map(async data => {
    await NewsModel.create(createNewsToModel(data));
  });
  return Promise.all(promises);
};
