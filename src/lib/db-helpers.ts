import { db } from "@/db";
import {
  posts,
  postTranslations,
  categories,
  categoryTranslations,
  tags,
  tagTranslations,
  postsToTags,
} from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import type {
  PostWithTranslations,
  Locale,
  TranslationData,
  CategoryWithTranslations,
  TagWithTranslations,
} from "@/lib/types";

/**
 * 批量获取文章的详细信息（翻译、分类、标签）
 * 解决 N+1 查询问题
 */
export async function getPostsDetails(postIds: number[], locale: Locale) {
  if (postIds.length === 0) {
    return {
      translations: {},
      categories: {},
      tags: {},
    };
  }

  // 批量查询所有文章的翻译
  const allTranslations = await db
    .select()
    .from(postTranslations)
    .where(inArray(postTranslations.postId, postIds));

  // 批量查询所有文章的分类ID
  const postsWithCategories = await db
    .select({
      postId: posts.id,
      categoryId: posts.categoryId,
    })
    .from(posts)
    .where(inArray(posts.id, postIds));

  const categoryIds = postsWithCategories
    .map((p) => p.categoryId)
    .filter((id): id is number => id !== null);

  // 批量查询分类及其翻译
  // Note: categoriesData 从数据库查询，不包含 translations 字段
  let categoriesData: any[] = [];
  let categoryTranslationsData: any[] = [];

  if (categoryIds.length > 0) {
    categoriesData = await db
      .select()
      .from(categories)
      .where(inArray(categories.id, categoryIds));

    categoryTranslationsData = await db
      .select()
      .from(categoryTranslations)
      .where(inArray(categoryTranslations.categoryId, categoryIds));
  }

  // 批量查询文章-标签关联
  const postTagsData = await db
    .select()
    .from(postsToTags)
    .where(inArray(postsToTags.postId, postIds));

  const tagIds = postTagsData.map((pt) => pt.tagId);

  // 批量查询标签及其翻译
  // Note: tagsData 从数据库查询，不包含 translations 字段
  let tagsData: any[] = [];
  let tagTranslationsData: any[] = [];

  if (tagIds.length > 0) {
    tagsData = await db.select().from(tags).where(inArray(tags.id, tagIds));

    tagTranslationsData = await db
      .select()
      .from(tagTranslations)
      .where(inArray(tagTranslations.tagId, tagIds));
  }

  // 组装数据结构 - 使用 Map 预分组优化 O(n²) 到 O(n)
  const translationsMap: Record<number, TranslationData[]> = {};
  for (const trans of allTranslations) {
    if (!translationsMap[trans.postId]) {
      translationsMap[trans.postId] = [];
    }
    translationsMap[trans.postId].push({
      locale: trans.locale,
      title: trans.title,
      content: trans.content,
      excerpt: trans.excerpt,
    });
  }

  // 预分组分类翻译，避免嵌套 filter 的 O(n²) 复杂度
  const categoryTranslationsMap: Record<number, any[]> = {};
  for (const trans of categoryTranslationsData) {
    if (!categoryTranslationsMap[trans.categoryId]) {
      categoryTranslationsMap[trans.categoryId] = [];
    }
    categoryTranslationsMap[trans.categoryId].push(trans);
  }

  const categoriesMap: Record<number, any> = {};
  for (const cat of categoriesData) {
    const catTrans = categoryTranslationsMap[cat.id] || [];
    categoriesMap[cat.id] = {
      id: cat.id,
      slug: cat.slug,
      translations: catTrans.map((t) => ({
        locale: t.locale,
        name: t.name,
      })),
    };
  }

  // 预分组标签翻译，避免嵌套 filter 的 O(n²) 复杂度
  const tagTranslationsMap: Record<number, any[]> = {};
  for (const trans of tagTranslationsData) {
    if (!tagTranslationsMap[trans.tagId]) {
      tagTranslationsMap[trans.tagId] = [];
    }
    tagTranslationsMap[trans.tagId].push(trans);
  }

  const tagsMap: Record<number, any> = {};
  for (const tag of tagsData) {
    const tagTrans = tagTranslationsMap[tag.id] || [];
    tagsMap[tag.id] = {
      id: tag.id,
      slug: tag.slug,
      translations: tagTrans.map((t) => ({
        locale: t.locale,
        name: t.name,
      })),
    };
  }

  // 为每篇文章组装完整数据
  const postsDetailsMap: Record<
    number,
    {
      translations: any[];
      category: any | null;
      tags: any[];
    }
  > = {};

  for (const postId of postIds) {
    const postCategory = postsWithCategories.find((p) => p.postId === postId);
    const category = postCategory?.categoryId
      ? categoriesMap[postCategory.categoryId]
      : null;

    const postTagRelations = postTagsData.filter((pt) => pt.postId === postId);
    const postTags = postTagRelations
      .map((pt) => tagsMap[pt.tagId])
      .filter(Boolean);

    postsDetailsMap[postId] = {
      translations: translationsMap[postId] || [],
      category,
      tags: postTags,
    };
  }

  return postsDetailsMap;
}

/**
 * 获取单个文章的详细信息
 */
export async function getPostDetails(postId: number) {
  const translations = await db
    .select()
    .from(postTranslations)
    .where(eq(postTranslations.postId, postId));

  let category = null;
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (post.length > 0 && post[0].categoryId) {
    const categoryData = await db
      .select()
      .from(categories)
      .where(eq(categories.id, post[0].categoryId))
      .limit(1);

    if (categoryData.length > 0) {
      const categoryTrans = await db
        .select()
        .from(categoryTranslations)
        .where(eq(categoryTranslations.categoryId, categoryData[0].id));

      category = {
        id: categoryData[0].id,
        slug: categoryData[0].slug,
        translations: categoryTrans.map((t) => ({
          locale: t.locale,
          name: t.name,
        })),
      };
    }
  }

  const postTags = await db
    .select()
    .from(postsToTags)
    .where(eq(postsToTags.postId, postId));

  const tagsData = [];
  for (const pt of postTags) {
    const tagData = await db
      .select()
      .from(tags)
      .where(eq(tags.id, pt.tagId))
      .limit(1);

    if (tagData.length > 0) {
      const tagTrans = await db
        .select()
        .from(tagTranslations)
        .where(eq(tagTranslations.tagId, tagData[0].id));

      tagsData.push({
        id: tagData[0].id,
        slug: tagData[0].slug,
        translations: tagTrans.map((t) => ({
          locale: t.locale,
          name: t.name,
        })),
      });
    }
  }

  return {
    translations: translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      content: t.content,
      excerpt: t.excerpt,
    })),
    category,
    tags: tagsData,
  };
}

/**
 * 格式化文章数据为标准格式
 */
export function formatPostWithTranslations(
  post: any,
  details: {
    translations: any[];
    category: any | null;
    tags: any[];
  },
): PostWithTranslations {
  return {
    ...post,
    translations: details.translations,
    category: details.category,
    tags: details.tags,
  };
}
