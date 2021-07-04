import { userViewAttributes } from '../../models/user';

export type CreatedAtFilter = {
  created_at: string | undefined;
  created_at__lt: string | undefined;
  created_at__gt: string | undefined;
};

export const getCreatedAtFilter = ({
  created_at,
  created_at__lt,
  created_at__gt,
}: CreatedAtFilter): string | null => {
  // console.log('stringify', created_at, created_at__gt, created_at__lt);
  if (created_at) return `'${created_at}'::date = DATE(n."createdAt")`;
  if (created_at__lt) return `'${created_at__lt}'::date > n."createdAt"`;
  if (created_at__gt) return `'${created_at__gt}'::date < n."createdAt"`;
  return null;
};

export type TagFilter = {
  tag: number | undefined;
  tags__in: number[] | undefined;
  tags__all: number[] | undefined;
};
const stringifyArray = (arr: number[]) => `ARRAY[${arr.toString()}]`;
export const getTagFilter = (filter: TagFilter): string | null => {
  // console.log('stringify', filter.tag, filter.tags__in, filter.tags__all);
  if (filter.tag) return `${filter.tag} = ANY (n."tagsIds")`;
  if (filter.tags__in) return `${stringifyArray(filter.tags__in)} && n."tagsIds"`;
  if (filter.tags__all)
    return `(${stringifyArray(filter.tags__all)} @> n."tagsIds") AND (${stringifyArray(
      filter.tags__all,
    )} <@ n."tagsIds")`;
  return null;
};

export type Filters = {
  authorName: string | undefined;
  categoryId: number | undefined;
  title: string | undefined;
  content: string | undefined;
};

export const getAuthorFilter = (authorName: string) =>
  authorName
    ? `
      '${authorName}' = (
        SELECT u."firstName"
        FROM "Authors" as a
        INNER JOIN "Users" as u ON a.id = u.id
        WHERE a.id = n."authorId"
      )
    `
    : null;

export const tagsToJSON = `SELECT json_build_object('id', t.id, 'label', t.label) as tag
    FROM "Tags" as t
    WHERE t.id = ANY (n."tagsIds")
    `;

export const categoryToJSON = `SELECT json_build_object('id', c.id, 'label', c.label, 'parentCategoryId', c."parentCategoryId")
    FROM "Categories" as c
    WHERE c.id = n."categoryId"
    `;

const userFields = userViewAttributes.map(f => `'${f}', u."${f}"`).join(', ');

export const authorToJSON = `SELECT json_build_object(${userFields}, 'discription', a.description) as author
    FROM "Authors" as a
    INNER JOIN "Users" as u ON a.id = u.id
    WHERE a.id = n."authorId"
    `;
