import * as Sequelize from 'sequelize/types';

import { createAuthorModel } from './author';
import { createCategoryModel } from './category';
import { createCommentModel } from './comments';
import { createNewsDraftModel, createNewsModel, NewsAttributes, NewsInstance } from './news';
import { createTagModel } from './tags';
import { createUserModel } from './user';

export interface NewsInstanceWithMixins extends NewsInstance {
  getNewsDraft: Sequelize.BelongsToGetAssociationMixin<NewsDraftInstanceWithMixins>;
  setNewsDraft: Sequelize.BelongsToSetAssociationMixin<
    NewsDraftInstanceWithMixins,
    NewsDraftInstanceWithMixins['id']
  >;
  createNewsDraft: Sequelize.BelongsToCreateAssociationMixin<NewsAttributes>;
}

export interface NewsDraftInstanceWithMixins extends NewsInstance {
  getNews: Sequelize.BelongsToGetAssociationMixin<NewsInstanceWithMixins>;
  setNews: Sequelize.BelongsToSetAssociationMixin<
    NewsInstanceWithMixins,
    NewsInstanceWithMixins['id']
  >;
  createNews: Sequelize.BelongsToCreateAssociationMixin<NewsAttributes>;
}

export const createModelsStore = (sequelize: Sequelize.Sequelize) => {
  const NewsDraftModel = createNewsDraftModel<NewsDraftInstanceWithMixins>(sequelize);
  const NewsModel = createNewsModel<NewsInstanceWithMixins>(sequelize);
  const AuthorModel = createAuthorModel(sequelize);
  const CommentModel = createCommentModel(sequelize);
  const CategoryModel = createCategoryModel(sequelize);
  const TagModel = createTagModel(sequelize);
  const UserModel = createUserModel(sequelize);

  NewsDraftModel.hasOne(NewsModel);
  NewsModel.belongsTo(NewsDraftModel, {
    // options dont work
    // foreignKey: {
    //   // name: 'draftId',
    //   allowNull: false,
    // },
    // onDelete: 'RESTRICT',
    // onUpdate: 'RESTRICT',
  });
  return {
    NewsModel,
    NewsDraftModel,
    AuthorModel,
    CommentModel,
    CategoryModel,
    TagModel,
    UserModel,
  };
};

export type ModelsStore = ReturnType<typeof createModelsStore>;
