import * as Sequelize from 'sequelize/types';

import { AuthorInstance, createAuthorModel } from './author';
import { CategoryInstance, createCategoryModel } from './category';
import { CommentInstance, createCommentModel } from './comments';
import {
  createNewsDraftModel,
  createNewsDraftTagsModel,
  createNewsModel,
  createNewsTagsModel,
  NewsInstance,
} from './news';
import { createTagModel, TagInstance } from './tags';
import { createUserModel, UserInstance } from './user';

// all mixin types in https://github.com/ahmerb/sequelize-typescript-associations
export interface NewsInstanceWithMixins extends NewsInstance {
  getNewsDraft: Sequelize.BelongsToGetAssociationMixin<NewsDraftInstanceWithMixins>;

  getComments: Sequelize.HasManyGetAssociationsMixin<CommentInstanceWithMixins>;
  addComments: Sequelize.HasManyAddAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  addComment: Sequelize.HasManyAddAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  createComment: Sequelize.HasManyCreateAssociationMixin<CommentInstanceWithMixins>;
  removeComment: Sequelize.HasManyRemoveAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  removeComments: Sequelize.HasManyRemoveAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  hasComment: Sequelize.HasManyHasAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  hasComments: Sequelize.HasManyHasAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  countComments: Sequelize.HasManyCountAssociationsMixin;

  getTags: Sequelize.HasManyGetAssociationsMixin<TagInstanceWithMixins>;
  addTags: Sequelize.HasManyAddAssociationsMixin<
    TagInstanceWithMixins,
    TagInstanceWithMixins['id']
  >;
  addTag: Sequelize.HasManyAddAssociationMixin<TagInstanceWithMixins, TagInstanceWithMixins['id']>;
  createTag: Sequelize.HasManyCreateAssociationMixin<TagInstanceWithMixins>;
  removeTag: Sequelize.HasManyRemoveAssociationMixin<
    TagInstanceWithMixins,
    TagInstanceWithMixins['id']
  >;
  removeTags: Sequelize.HasManyRemoveAssociationsMixin<
    TagInstanceWithMixins,
    TagInstanceWithMixins['id']
  >;
  hasTag: Sequelize.HasManyHasAssociationMixin<TagInstanceWithMixins, TagInstanceWithMixins['id']>;
  hasTags: Sequelize.HasManyHasAssociationsMixin<
    TagInstanceWithMixins,
    TagInstanceWithMixins['id']
  >;
  countTags: Sequelize.HasManyCountAssociationsMixin;
}

export interface NewsDraftInstanceWithMixins extends NewsInstance {
  getNews: Sequelize.BelongsToGetAssociationMixin<NewsInstanceWithMixins>;
  createNews: Sequelize.BelongsToCreateAssociationMixin<NewsInstanceWithMixins>;

  getComments: Sequelize.HasManyGetAssociationsMixin<CommentInstanceWithMixins>;
  addComments: Sequelize.HasManyAddAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  addComment: Sequelize.HasManyAddAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  createComment: Sequelize.HasManyCreateAssociationMixin<CommentInstanceWithMixins>;
  removeComment: Sequelize.HasManyRemoveAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  removeComments: Sequelize.HasManyRemoveAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  hasComment: Sequelize.HasManyHasAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  hasComments: Sequelize.HasManyHasAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  countComments: Sequelize.HasManyCountAssociationsMixin;

  getTags: Sequelize.HasManyGetAssociationsMixin<TagInstanceWithMixins>;
  addTags: Sequelize.HasManyAddAssociationsMixin<
    TagInstanceWithMixins,
    TagInstanceWithMixins['id']
  >;
  addTag: Sequelize.HasManyAddAssociationMixin<TagInstanceWithMixins, TagInstanceWithMixins['id']>;
  createTag: Sequelize.HasManyCreateAssociationMixin<TagInstanceWithMixins>;
  removeTag: Sequelize.HasManyRemoveAssociationMixin<
    TagInstanceWithMixins,
    TagInstanceWithMixins['id']
  >;
  removeTags: Sequelize.HasManyRemoveAssociationsMixin<
    TagInstanceWithMixins,
    TagInstanceWithMixins['id']
  >;
  hasTag: Sequelize.HasManyHasAssociationMixin<TagInstanceWithMixins, TagInstanceWithMixins['id']>;
  hasTags: Sequelize.HasManyHasAssociationsMixin<
    TagInstanceWithMixins,
    TagInstanceWithMixins['id']
  >;
  countTags: Sequelize.HasManyCountAssociationsMixin;
}

export interface UserInstanceWithMixins extends UserInstance {
  getAuthor: Sequelize.BelongsToGetAssociationMixin<AuthorInstanceWithMixins>;
  createAuthor: Sequelize.BelongsToCreateAssociationMixin<AuthorInstanceWithMixins>;

  getComments: Sequelize.HasManyGetAssociationsMixin<CommentInstanceWithMixins>;
  addComments: Sequelize.HasManyAddAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  addComment: Sequelize.HasManyAddAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  createComment: Sequelize.HasManyCreateAssociationMixin<CommentInstanceWithMixins>;
  removeComment: Sequelize.HasManyRemoveAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  removeComments: Sequelize.HasManyRemoveAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  hasComment: Sequelize.HasManyHasAssociationMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
  hasComments: Sequelize.HasManyHasAssociationsMixin<
    CommentInstanceWithMixins,
    CommentInstanceWithMixins['id']
  >;
}

export interface AuthorInstanceWithMixins extends AuthorInstance {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstanceWithMixins>;
}

export interface CommentInstanceWithMixins extends CommentInstance {
  getUser: Sequelize.BelongsToGetAssociationMixin<UserInstanceWithMixins>;
}

export interface CategoryInstanceWithMixins extends CategoryInstance {
  getParent: Sequelize.BelongsToGetAssociationMixin<CategoryInstanceWithMixins>;
  getChildren: Sequelize.BelongsToGetAssociationMixin<CategoryInstanceWithMixins>;
  createChildren: Sequelize.BelongsToCreateAssociationMixin<CategoryInstanceWithMixins>;
}

export interface TagInstanceWithMixins extends TagInstance {}

const getOptions = (key: string) => ({
  foreignKey: {
    name: key,
    allowNull: false,
  },
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
});

/**
 *  initialize models and associations
 */
export const createModelsStore = (sequelize: Sequelize.Sequelize) => {
  const NewsDraftModel = createNewsDraftModel<NewsDraftInstanceWithMixins>(sequelize);
  const NewsModel = createNewsModel<NewsInstanceWithMixins>(sequelize);
  const UserModel = createUserModel<UserInstanceWithMixins>(sequelize);
  const AuthorModel = createAuthorModel<AuthorInstanceWithMixins>(sequelize);
  const CommentModel = createCommentModel<CommentInstanceWithMixins>(sequelize);
  const CategoryModel = createCategoryModel(sequelize);
  const TagModel = createTagModel(sequelize);
  const NewsTagModel = createNewsTagsModel(sequelize, NewsModel, TagModel);
  const NewsDraftTagModel = createNewsDraftTagsModel(sequelize, NewsDraftModel, TagModel);

  CategoryModel.hasOne(CategoryModel, {
    foreignKey: {
      name: 'parentCategoryId',
      allowNull: false,
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    as: 'children',
  });
  CategoryModel.belongsTo(CategoryModel, {
    foreignKey: {
      name: 'parentCategoryId',
      allowNull: false,
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    as: 'parent',
  });

  UserModel.hasOne(AuthorModel, getOptions('userId'));
  AuthorModel.belongsTo(UserModel, getOptions('userId'));

  NewsDraftModel.hasOne(NewsModel, getOptions('draftId'));
  NewsModel.belongsTo(NewsDraftModel, getOptions('draftId'));
  // todo add mixins
  AuthorModel.hasMany(NewsModel, getOptions('authorId'));
  NewsModel.belongsTo(AuthorModel, getOptions('authorId'));
  AuthorModel.hasMany(NewsDraftModel, getOptions('authorId'));
  NewsDraftModel.belongsTo(AuthorModel, getOptions('authorId'));
  // todo add mixins
  CategoryModel.hasMany(NewsModel, getOptions('categoryId'));
  NewsModel.belongsTo(CategoryModel, getOptions('categoryId'));
  CategoryModel.hasMany(NewsDraftModel, getOptions('categoryId'));
  NewsDraftModel.belongsTo(CategoryModel, getOptions('categoryId'));

  TagModel.belongsToMany(NewsModel, { through: NewsTagModel });
  NewsModel.belongsToMany(TagModel, { through: NewsTagModel });
  TagModel.belongsToMany(NewsDraftModel, { through: NewsDraftTagModel });
  NewsDraftModel.belongsToMany(TagModel, { through: NewsDraftTagModel });

  UserModel.hasMany(CommentModel, getOptions('userId'));
  CommentModel.belongsTo(UserModel, getOptions('userId'));
  NewsModel.hasMany(CommentModel, getOptions('newsId'));
  CommentModel.belongsTo(NewsModel, getOptions('newsId'));

  return {
    NewsModel,
    NewsDraftModel,
    AuthorModel,
    CommentModel,
    CategoryModel,
    TagModel,
    UserModel,
    NewsTagModel,
    NewsDraftTagModel,
  };
};

export type ModelsStore = ReturnType<typeof createModelsStore>;
