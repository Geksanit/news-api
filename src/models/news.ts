/* eslint-disable no-restricted-syntax */

/* eslint-disable no-await-in-loop */
import { pick } from 'ramda';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { News as TNEws, CreateNews } from 'src/types/generated';

import { getTimeout } from '../utils/Promise';
import { ModelsStore } from './models.store';
import { createTagModel, TagInstance } from './tags';

type NewsDB = Omit<TNEws, 'tagIds'>;
type CreateNewsDB = Omit<CreateNews, 'tagIds'>;

export interface NewsInstance extends Model<NewsDB, CreateNewsDB & { authorId: number }>, NewsDB {}
export type NewsTags = { NewsId: number; TagId: number };
export interface NewsTagsInstance extends Model<NewsTags, NewsTags>, NewsTags {}
export type DraftTags = { DraftId: number; TagId: number };
export interface DraftTagsInstance extends Model<DraftTags, DraftTags>, DraftTags {}
export type NewsAttributes = NewsDB;

const attributers = {
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
  content: {
    type: DataTypes.TEXT,
  },
  topPhotoLink: {
    type: DataTypes.STRING,
  },
  photoLinks: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  createdAt: {
    type: DataTypes.DATE,
  },
};

export const createNewsModel = <Instance extends NewsInstance>(sequalize: Sequelize) =>
  sequalize.define<Instance, NewsAttributes>('News', attributers);

export const createDraftModel = <Instance extends NewsInstance>(sequalize: Sequelize) =>
  sequalize.define<Instance, NewsAttributes>('Draft', attributers);

export const createNewsTagsModel = <Instance extends NewsTagsInstance>(
  sequalize: Sequelize,
  NewsModel: ReturnType<typeof createNewsModel>,
  TagModel: ReturnType<typeof createTagModel>,
) =>
  sequalize.define<Instance, NewsTags>('NewsTags', {
    NewsId: {
      type: DataTypes.INTEGER,
      references: {
        model: NewsModel,
        key: 'id',
      },
    },
    TagId: {
      type: DataTypes.INTEGER,
      references: {
        model: TagModel,
        key: 'id',
      },
    },
  });

export const createDraftTagsModel = <Instance extends DraftTagsInstance>(
  sequalize: Sequelize,
  DraftModel: ReturnType<typeof createDraftModel>,
  TagModel: ReturnType<typeof createTagModel>,
) =>
  sequalize.define<Instance, DraftTags>('DraftTags', {
    DraftId: {
      type: DataTypes.INTEGER,
      references: {
        model: DraftModel,
        key: 'id',
      },
    },
    TagId: {
      type: DataTypes.INTEGER,
      references: {
        model: TagModel,
        key: 'id',
      },
    },
  });

export const newsAttributes: Array<keyof NewsDB> = [
  'id',
  'title',
  'authorId',
  'categoryId',
  'content',
  'createdAt',
  'topPhotoLink',
  'photoLinks',
];

export const getNewsFromInstance = (instance: NewsInstance): NewsDB =>
  pick<keyof NewsDB>(newsAttributes)(instance);

export const createNewsToModel = ({
  ...rest
}: CreateNewsDB & { authorId: number }): Omit<NewsDB, 'id'> => {
  return {
    ...rest,
    createdAt: new Date(Date.now()).toISOString(),
  };
};

export const initNewsData = async (
  seq: Sequelize,
  { NewsModel, DraftModel, TagModel, NewsTagModel, DraftTagModel }: ModelsStore,
) => {
  await DraftModel.sync({ force: true });
  await NewsModel.sync({ force: true });
  await DraftTagModel.sync({ force: true });
  await NewsTagModel.sync({ force: true });

  for (const d of initialData) {
    const { isPublished, tagIds, ...data } = d;
    // eslint-disable-next-line no-console
    console.log('timeout 1000');
    await getTimeout(1000);
    const value = createNewsToModel(data);
    const draftInstance = await DraftModel.create(value);
    const tagsA = await Promise.all(
      tagIds.map(tagId => TagModel.findOne({ where: { id: tagId } })),
    );
    const tags = tagsA.filter(v => v) as TagInstance[];
    await draftInstance.addTags(tags);
    if (isPublished) {
      const newsInstance = await draftInstance.createNews(value);
      await newsInstance.addTags(tags);
    }
  }
};

export const initialData: Array<CreateNews & { authorId: number; isPublished: boolean }> = [
  {
    title: 'Грузовик с томатным пюре разбивается, дорога становится красной',
    categoryId: 1,
    tagIds: [2, 4],
    content: `На этой неделе в Англии разбился грузовик, груженый томатным пюре, в результате чего шоссе стало красным, что вызвало ряд каламбурных слов, связанных с едой, со стороны людей в социальных сетях.
    Автомобиль попал в аварию с другим грузовиком в Кембриджшире, восточная Англия, во вторник, сообщили CNN в Highways England.
    Управление государственных автомагистралей заявило, что автомобиль «потерял груз и повредил проезжую часть», что привело к перекрытию дороги на A14.
    Один водитель получил "легкую" травму, сообщает Highways England.
    Представитель компании подтвердил, что везет томатное пюре, которое разлилось через дорогу и привело к экстренному ремонту дороги в течение ночи до полудня среды.`,
    topPhotoLink:
      'https://cdn.cnn.com/cnnnext/dam/assets/210603052531-restricted-england-crash-tomato-puree-0602-exlarge-169.jpg',
    photoLinks: [],
    isPublished: true,
    authorId: 1,
  },
  {
    title:
      'Новая Зеландия находится в стороне от Китая на пять глаз. Возможно, придется выбрать сторону',
    categoryId: 2,
    tagIds: [10],
    content: `«Может быть, Новая Зеландия превращается в ... Новую Землю Кси?» - спросил зловещий голос.
    Это было частью превью зажигательного сегмента австралийского телешоу "60 минут", основанного на идее о том, что Новая Зеландия так отчаянно пытается удержать Китай, своего крупнейшего торгового партнера, в стороне, что отбросила как свою мораль, так и дружбу с Канберра.`,
    topPhotoLink:
      'https://cdn.cnn.com/cnnnext/dam/assets/210602221801-05-new-zealand-xinjiang-china-intl-hnk-exlarge-169.jpg',
    photoLinks: ['photo1', 'photo2', 'photo3'],
    isPublished: true,
    authorId: 2,
  },
  {
    title: 'Солнечный зонд Parker совершает исторический проход сквозь атмосферу Солнца',
    categoryId: 1,
    tagIds: [1],
    content: `Американское космическое агентство (НАСА) называет это историческим моментом - первый раз космический корабль пролетел через внешнюю атмосферу Солнца.`,
    topPhotoLink:
      'https://ichef.bbci.co.uk/news/976/cpsprodpb/A12D/production/_102816214_observingsunposter-jhu-apl.jpg',
    photoLinks: ['photo1', 'photo2', 'photo3', 'photo4', 'photo5'],
    authorId: 1,
    isPublished: true,
  },
  {
    title: 'Lorem Ipsum',
    categoryId: 1,
    tagIds: [1, 2],
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut facilisis risus feugiat, feugiat augue et, euismod libero. Duis eget arcu iaculis, commodo sem quis, faucibus lacus. Nulla sollicitudin nulla vel finibus semper. Vestibulum placerat velit urna, ac egestas massa posuere sed. Vestibulum eu quam est. Proin magna quam, ultricies sed neque volutpat, dapibus cursus leo. Vestibulum lectus ipsum, euismod eu quam vitae, scelerisque laoreet nibh. Maecenas erat justo, consectetur ut euismod eu, pretium id turpis.`,
    topPhotoLink:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk9Vd-AuBS0FJi6i3l6SvCHPRByX7aGtFusw&usqp=CAU',
    photoLinks: [],
    authorId: 2,
    isPublished: false,
  },
  {
    title:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
    categoryId: 1,
    tagIds: [1, 2],
    content: `Donec commodo quis augue vel maximus. Maecenas nunc elit, porttitor a nunc sit amet, sollicitudin tincidunt nisl. Nullam gravida felis in suscipit faucibus. Duis elementum ipsum et molestie gravida. Morbi aliquam justo nec sagittis volutpat. Donec et condimentum diam. Quisque pellentesque felis vitae elit laoreet, varius vestibulum purus dignissim.`,
    topPhotoLink:
      'https://assets.anantara.com/image/upload/q_auto,f_auto/media/minor/anantara/images/anantara-mui-ne-resort/experiences/phan-thiet-explorer-tour/anantara_mui_ne_phanthiet_intro_944x510.jpg',
    photoLinks: ['photo1', 'photo2'],
    authorId: 1,
    isPublished: false,
  },
  {
    title: `Перес выиграл Гран-при Азербайджана, Ферстаппен в роли лидера разбил болид за несколько кругов до финиша`,
    categoryId: 7,
    tagIds: [4, 5, 9],
    content: `Пилот «Ред Булл» Серхио Перес стал победителем Гран-при Азербайджана благодаря аварии своего напарника по команде Макса Ферстаппена.`,
    topPhotoLink:
      'https://s-cdn.sportbox.ru/images/styles/690_388/fp_fotos/51/1a/52dd152d8bb104d0de230c773bee064660bdb0d12ed5b104016824.jpg',
    photoLinks: [
      'https://ichef.bbci.co.uk/onesport/cps/800/cpsprodpb/765E/production/_118820303_baku.jpg',
    ],
    authorId: 1,
    isPublished: true,
  },
  {
    title:
      'Нападающий «Барселоны» Мартин Брейтуэйт забил, когда Дания обыграла Боснию и Герцеговину в финальном матче разминки перед Евро-2020.',
    categoryId: 5,
    tagIds: [6],
    content: `Donec volutpat, mi in porta efficitur, mi quam sodales augue, sit amet suscipit nunc felis ac urna. Nunc eu lorem eu purus ultrices viverra. Maecenas quis sagittis ex, in maximus nulla. Curabitur quis orci egestas, sodales enim et, auctor eros. Donec faucibus sem id ultrices iaculis. Aliquam metus leo, consequat in erat nec, aliquam tristique nisl. Ut venenatis, mi eget vulputate semper, erat odio rhoncus purus, vel volutpat ligula eros vel ligula. Duis ac dictum erat. Pellentesque nec nisl nec ante ullamcorper pellentesque non eu urna. Nam ultricies convallis metus, id consequat augue dictum consectetur.`,
    topPhotoLink:
      'https://ichef.bbci.co.uk/onesport/cps/800/cpsprodpb/11762/production/_118822517_hi067868737.jpg',
    photoLinks: [''],
    authorId: 1,
    isPublished: true,
  },

  {
    title: '6 простых способов сделать свои собственные мемы',
    categoryId: 1,
    tagIds: [3],
    content: `Лучшие мемы забавны, используются в нужное время и говорят правильные вещи. Их легко найти в Интернете, но иногда лучшие из них — это те, которые вы делаете, идеально подходящие на данный момент. Они могут быть мучительно неудобными, но могут быть и очень и очень забавными. Если вас внезапно поразило комическое вдохновение, хорошая новость заключается в том, что эти мемы действительно легко создать: вам не нужно много художественного таланта или навыков графического дизайна, просто хорошая идея (и удачное время.) Независимо от того, используете ли вы свой компьютер или телефон, вот приложения и инструменты, необходимые для создания мемов. Canva Canva обладает множеством функций, но проста в использовании. Canva через Дэвида Нильда Canva предлагает множество полезных инструментов графического дизайна для всех, от новичков до профессионалов отрасли, и даже есть встроенный генератор мемов, как хорошо. Щелкните Create a New Meme и все готово, хотя вам придется зарегистрировать бесплатную учетную запись, если вы хотите сохранить и экспортировать свой дизайн. Вы получите удобный Вкладка Шаблоны если вы хотите адаптировать существующий мем, или вы можете переключиться на Загрузки чтобы выбрать собственное изображение. Используйте инструмент Текст чтобы поместить несколько слов поверх выбранного изображения: Canva предлагает множество различных вариантов шрифта, эффектов, цвета и размера текста, и это один из лучших вариантов. для полного контроля над тем, как выглядит ваш мем. Canva также доступна для Android и iOS.
    Источник: https://artforlife.ru/prochie-tematiki/6-prostyh-sposobov-sdelat-svoi-sobstvennye-memy.html © https://artforlife.ru/`,
    topPhotoLink: '',
    photoLinks: [''],
    authorId: 1,
    isPublished: true,
  },
  {
    title: 'Мировой финал «Ф1 в школах» покажет в прямом эфире Motorsport.tv',
    categoryId: 7,
    tagIds: [6, 7],
    content: `Лондон, 4 июня 2021 года: Мировой финал программы «Ф1 в школах» будет показан в прямом эфире на новом канале, посвященном этой инициативе на Motorsport.tv – специализированной платформе сети Motorsport Network, охватывающей международную аудиторию.

    «Ф1 в школах», используя захватывающий образ Формулы 1, вдохновляет детей изучать науку, технологии, инженерное дело и математические предметы, чтобы затем делать карьеру в этих областях. `,
    topPhotoLink:
      'https://cdn-1.motorsport.com/images/amp/YXR9ONx0/s1000/f1-in-schools-world-final-to-b.webp',
    photoLinks: [''],
    authorId: 1,
    isPublished: true,
  },
  {
    title: `Кристофферссон вновь стал чемпионом мира по ралли-кроссу`,
    categoryId: 7,
    tagIds: [4, 8],
    content: `Йохан Кристофферсон завоевал четвертый титул чемпиона мира по ралли-кроссу после двух этапов в один уик-энд на Нюрбургринге. Он выиграл в первый день и стал вторым во второй, так что благодаря заработанным за уик-энд очкам смог выйти в лидеры.`,
    topPhotoLink:
      'https://cdn-1.motorsport.com/images/amp/0k7DvAV0/s1000/podium-johan-kristoffersson-ky.webp',
    photoLinks: [''],
    authorId: 1,
    isPublished: true,
  },
];
