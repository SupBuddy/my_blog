'use server';

import { db } from '@/db';
import { posts, postTranslations, categories, categoryTranslations, tags, tagTranslations, postsToTags } from '@/db/schema';
import { eq, and, desc, lt } from 'drizzle-orm';
import type { PostWithTranslations, Locale } from '@/lib/types';

// 获取文章列表（带分页）
export async function getPosts(
  locale: Locale = 'zh',
  limit: number = 10,
  cursor?: number
): Promise<{ posts: PostWithTranslations[]; nextCursor: number | null }> {
  try {
    const whereCondition = cursor 
      ? and(eq(posts.published, true), lt(posts.id, cursor))
      : eq(posts.published, true);

    const results = await db
      .select()
      .from(posts)
      .where(whereCondition)
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
      .limit(limit);

    const postsWithTranslations: PostWithTranslations[] = [];

    for (const post of results) {
      // 获取文章翻译
      const translations = await db
        .select()
        .from(postTranslations)
        .where(eq(postTranslations.postId, post.id));

      // 获取分类
      let category = null;
      if (post.categoryId) {
        const categoryData = await db
          .select()
          .from(categories)
          .where(eq(categories.id, post.categoryId))
          .limit(1);

        if (categoryData.length > 0) {
          const categoryTrans = await db
            .select()
            .from(categoryTranslations)
            .where(eq(categoryTranslations.categoryId, categoryData[0].id));

          category = {
            id: categoryData[0].id,
            slug: categoryData[0].slug,
            translations: categoryTrans.map(t => ({
              locale: t.locale,
              name: t.name,
            })),
          };
        }
      }

      // 获取标签
      const postTags = await db
        .select()
        .from(postsToTags)
        .where(eq(postsToTags.postId, post.id));

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
            translations: tagTrans.map(t => ({
              locale: t.locale,
              name: t.name,
            })),
          });
        }
      }

      postsWithTranslations.push({
        ...post,
        translations: translations.map(t => ({
          locale: t.locale,
          title: t.title,
          content: t.content,
          excerpt: t.excerpt,
        })),
        category,
        tags: tagsData,
      });
    }

    const nextCursor = results.length === limit ? results[results.length - 1].id : null;

    return { posts: postsWithTranslations, nextCursor };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], nextCursor: null };
  }
}

// 获取文章详情
export async function getPostBySlug(
  slug: string,
  locale: Locale = 'zh'
): Promise<PostWithTranslations | null> {
  try {
    const post = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.published, true)))
      .limit(1);

    if (post.length === 0) {
      return null;
    }

    const postData = post[0];

    // 获取文章翻译
    const translations = await db
      .select()
      .from(postTranslations)
      .where(eq(postTranslations.postId, postData.id));

    // 获取分类
    let category = null;
    if (postData.categoryId) {
      const categoryData = await db
        .select()
        .from(categories)
        .where(eq(categories.id, postData.categoryId))
        .limit(1);

      if (categoryData.length > 0) {
        const categoryTrans = await db
          .select()
          .from(categoryTranslations)
          .where(eq(categoryTranslations.categoryId, categoryData[0].id));

        category = {
          id: categoryData[0].id,
          slug: categoryData[0].slug,
          translations: categoryTrans.map(t => ({
            locale: t.locale,
            name: t.name,
          })),
        };
      }
    }

    // 获取标签
    const postTags = await db
      .select()
      .from(postsToTags)
      .where(eq(postsToTags.postId, postData.id));

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
          translations: tagTrans.map(t => ({
            locale: t.locale,
            name: t.name,
          })),
        });
      }
    }

    return {
      ...postData,
      translations: translations.map(t => ({
        locale: t.locale,
        title: t.title,
        content: t.content,
        excerpt: t.excerpt,
      })),
      category,
      tags: tagsData,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}