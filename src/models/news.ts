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

export const newsAttributes: Array<keyof News> = [
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
];

export const getNewsFromInstance = (instance: NewsInstance): News =>
  pick<keyof News>(newsAttributes)(instance);

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
    categoryId: 1,
    tagsIds: [1, 2],
    content: `A truck laden with tomato puree crashed in England this week, turning a highway red and prompting a number of food-related puns from people on social media.
    The vehicle was involved in a crash with another truck in Cambridgeshire, eastern England, on Tuesday, Highways England told CNN.
    The government highways authority said the vehicle "lost its load and damaged the carriageway," leading to a road closure on the A14.
    One driver sustained a "minor" injury, Highways England said.
    A spokesman confirmed it was carrying tomato puree, which spilled across the road and prompted emergency road resurfacing overnight until Wednesday afternoon.`,
    topPhotoLink:
      'https://cdn.cnn.com/cnnnext/dam/assets/210603052531-restricted-england-crash-tomato-puree-0602-exlarge-169.jpg',
    photoLinks: ['photo1'],
    isDraft: false,
    authorId: 1,
  },
  {
    title: 'New Zealand is a Five Eyes outlier on China. It may have to pick a side',
    categoryId: 1,
    tagsIds: [1, 2],
    content: `"Could it be that New Zealand is turning into ... New Xi Land?" questioned an ominous voice over.
    It was part of a preview for an incendiary segment of Australian TV show "60 Minutes" premised on the idea that New Zealand is so desperate to keep China, its biggest trading partner, onside that it has cast aside both its morals and its friendship with Canberra.`,
    topPhotoLink:
      'https://cdn.cnn.com/cnnnext/dam/assets/210602221801-05-new-zealand-xinjiang-china-intl-hnk-exlarge-169.jpg',
    photoLinks: ['photo1', 'photo2', 'photo3'],
    isDraft: false,
    authorId: 2,
  },
  {
    title: 'My SUPER clickbait news',
    categoryId: 1,
    tagsIds: [2],
    content: `bla bla bla`,
    topPhotoLink: 'https://google.com/xaxaxa.jpg',
    photoLinks: ['photo1', 'photo2', 'photo3', 'photo4', 'photo5'],
    isDraft: true,
    authorId: 1,
  },
  {
    title: 'Lorem Ipsum',
    categoryId: 1,
    tagsIds: [1, 2],
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut facilisis risus feugiat, feugiat augue et, euismod libero. Duis eget arcu iaculis, commodo sem quis, faucibus lacus. Nulla sollicitudin nulla vel finibus semper. Vestibulum placerat velit urna, ac egestas massa posuere sed. Vestibulum eu quam est. Proin magna quam, ultricies sed neque volutpat, dapibus cursus leo. Vestibulum lectus ipsum, euismod eu quam vitae, scelerisque laoreet nibh. Maecenas erat justo, consectetur ut euismod eu, pretium id turpis.`,
    topPhotoLink: '',
    photoLinks: [],
    isDraft: true,
    authorId: 2,
  },
  {
    title:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    categoryId: 1,
    tagsIds: [1, 2],
    content: `Donec commodo quis augue vel maximus. Maecenas nunc elit, porttitor a nunc sit amet, sollicitudin tincidunt nisl. Nullam gravida felis in suscipit faucibus. Duis elementum ipsum et molestie gravida. Morbi aliquam justo nec sagittis volutpat. Donec et condimentum diam. Quisque pellentesque felis vitae elit laoreet, varius vestibulum purus dignissim.`,
    topPhotoLink: '',
    photoLinks: ['photo1', 'photo2'],
    isDraft: false,
    authorId: 1,
  },
  {
    title: `Azerbaijan Grand Prix: Sergio Perez wins after Max Verstappen high speed crash`,
    categoryId: 6,
    tagsIds: [5, 4],
    content: `Duis pharetra vestibulum felis, non posuere lorem placerat iaculis. Maecenas hendrerit commodo dapibus. Integer sapien erat, efficitur convallis auctor et, pellentesque at turpis. Sed hendrerit ante nisi, et mattis odio pellentesque nec. Aenean purus arcu, posuere id porttitor sagittis, tristique quis ante. Duis a laoreet neque. Proin a urna semper, molestie mi vitae, tristique velit. Proin non blandit sem.`,
    topPhotoLink:
      'https://ichef.bbci.co.uk/onesport/cps/800/cpsprodpb/765E/production/_118820303_baku.jpg',
    photoLinks: [''],
    isDraft: false,
    authorId: 1,
  },
  {
    title:
      'Barcelona forward Martin Braithwaite scored as Denmark beat Bosnia-Herzegovina in their final warm-up match before Euro 2020.',
    categoryId: 4,
    tagsIds: [6],
    content: `Donec volutpat, mi in porta efficitur, mi quam sodales augue, sit amet suscipit nunc felis ac urna. Nunc eu lorem eu purus ultrices viverra. Maecenas quis sagittis ex, in maximus nulla. Curabitur quis orci egestas, sodales enim et, auctor eros. Donec faucibus sem id ultrices iaculis. Aliquam metus leo, consequat in erat nec, aliquam tristique nisl. Ut venenatis, mi eget vulputate semper, erat odio rhoncus purus, vel volutpat ligula eros vel ligula. Duis ac dictum erat. Pellentesque nec nisl nec ante ullamcorper pellentesque non eu urna. Nam ultricies convallis metus, id consequat augue dictum consectetur.`,
    topPhotoLink:
      'https://ichef.bbci.co.uk/onesport/cps/800/cpsprodpb/11762/production/_118822517_hi067868737.jpg',
    photoLinks: [''],
    isDraft: false,
    authorId: 1,
  },

  {
    title: '6 Easy Ways to Make Your Own Memes',
    categoryId: 1,
    tagsIds: [3],
    content: `Integer quis metus a est sodales congue eu a ipsum. Vestibulum hendrerit, ligula sed pulvinar lobortis, lectus felis aliquet mi, vel iaculis magna quam quis ante. Quisque at molestie odio, vitae efficitur libero. Phasellus ut molestie urna, eget sollicitudin quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque urna metus, vestibulum id lectus lobortis, facilisis placerat eros. Pellentesque interdum vel nibh ut fermentum. Sed euismod interdum ligula, ac facilisis nulla blandit at. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tristique volutpat pretium. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`,
    topPhotoLink: '',
    photoLinks: [''],
    isDraft: false,
    authorId: 1,
  },
  {
    title: 'F1 in Schools World Final to be shown live on Motorsport.tv',
    categoryId: 6,
    tagsIds: [4, 8],
    content: `F1 in Schools, set up in 1999, has welcome thousands of school to join the competition since its formation – reaching over 52 countries so far – and is aimed at inspiring children to experience science, technology, engineering and mathematics through F1`,
    topPhotoLink: '',
    photoLinks: [''],
    isDraft: false,
    authorId: 1,
  },
  {
    title: `Kleinschmidt's unexpected return to racing with CUPRA`,
    categoryId: 7,
    tagsIds: [4, 8],
    content: `Integer quis metus a est sodales congue eu a ipsum. Vestibulum hendrerit, ligula sed pulvinar lobortis, lectus felis aliquet mi, vel iaculis magna quam quis ante. Quisque at molestie odio, vitae efficitur libero. Phasellus ut molestie urna, eget sollicitudin quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque urna metus, vestibulum id lectus lobortis, facilisis placerat eros. Pellentesque interdum vel nibh ut fermentum. Sed euismod interdum ligula, ac facilisis nulla blandit at. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tristique volutpat pretium. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`,
    topPhotoLink:
      'https://cdn-2.motorsport.com/images/mgl/24v8gOd6/s8/jutta-kleinschmidt-mattias-eks-1.jpg',
    photoLinks: [''],
    isDraft: false,
    authorId: 1,
  },
];

export const initNewsData = async (sequelize: Sequelize, isDropTable: boolean) => {
  const NewsModel = createNewsModel(sequelize);
  if (isDropTable) {
    await NewsModel.drop();
  }
  await NewsModel.sync({ force: true });
  const promises = initialCategories.map(async data => {
    await NewsModel.create(createNewsToModel(data));
  });
  return Promise.all(promises);
};
