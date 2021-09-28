import { userViewAttributes } from '../../models/user';
import { NewsOrder } from '../../types/generated';

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
  if (created_at) return `:created_at::date = DATE(n."createdAt")`;
  if (created_at__lt) return `:created_at__lt::date > n."createdAt"`;
  if (created_at__gt) return `:created_at__gt::date < n."createdAt"`;
  return null;
};

export type TagFilter = {
  tag: number | undefined;
  tags__in: number[] | undefined;
  tags__all: number[] | undefined;
};

export const getTagFilter = (filter: TagFilter): string | null => {
  if (filter.tag) return `:tag = ANY (n."tagsIds")`;
  if (filter.tags__in) return `ARRAY[:tags__in] && n."tagsIds"`;
  if (filter.tags__all)
    return `(ARRAY[:tags__all] @> n."tagsIds") AND (ARRAY[:tags__all] <@ n."tagsIds")`;
  return null;
};

export type Filters = {
  authorName: string | undefined;
  categoryId: number | undefined;
  title: string | undefined;
  content: string | undefined;
  searchText: string | undefined;
};

export const getSearchTextFilter = (text: string | undefined) =>
  text
    ? `(
      n.content LIKE :searchTextLike OR
      :searchText = u."firstName" OR
      :searchText = c.label OR
      :searchText = ANY(ARRAY(
        SELECT t.label
        FROM "Tags" as t
        WHERE t.id = ANY(n."tagsIds")
      ))
    )`
    : null;

export const tagsToJSON = `
  SELECT json_build_object('id', t.id, 'label', t.label) as tag
  FROM "NewsTags" as nt
  JOIN "Tags" as t ON t.id = nt."TagId"
  WHERE nt."NewsId" = n.id
`;

// old, not recursive query
// export const categoryToJSON = `SELECT json_build_object('id', c.id, 'label', c.label, 'parentCategoryId', c."parentCategoryId")
//     FROM "Categories" as c
//     WHERE c.id = n."categoryId"
//     `;

export const categoryToJSON = `
  WITH RECURSIVE r AS (
    SELECT c.id, c."parentCategoryId", c.label
    FROM "Categories" as c
    WHERE c.id = n."categoryId"
    UNION
    SELECT c.id, c."parentCategoryId", c.label
    FROM "Categories" as c
      JOIN r
          ON c.id = r."parentCategoryId"
  )
  SELECT json_build_object('id', r.id, 'label', r.label, 'parentCategoryId', r."parentCategoryId")
  FROM r
`;

const userFields = userViewAttributes.map(f => `'${f}', u."${f}"`).join(', ');
export const authorToJSON = `json_build_object(${userFields}, 'discription', a.description)`;

export const getOrder = ({
  by = NewsOrder.by.DATE,
  direction = NewsOrder.direction.ASC,
}: NewsOrder): string => {
  const d = direction === NewsOrder.direction.ASC ? 'ASC' : 'DESC';
  switch (by) {
    case NewsOrder.by.DATE:
      return `BY n."createdAt" ${d}`;
    case NewsOrder.by.AUTHOR:
      return `BY u.username ${d}`;
    case NewsOrder.by.CATEGORY:
      return `BY c."label" ${d}`;
    case NewsOrder.by.PHOTO_COUNT:
      return `BY array_length(n."photoLinks", 1) ${d}`;
  }
};
