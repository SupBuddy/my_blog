'use server';

import { db } from '@/db';
import { posts, categories, tags, postTranslations } from '@/db/schema';
import { desc, eq, count } from 'drizzle-orm';

export async function getDashboardStats() {
  try {
    // 总文章数
    const totalPosts = await db.select({ count: count() }).from(posts);
    
    // 已发布文章数
    const publishedPosts = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.published, true));
    
    // 草稿文章数
    const draftPosts = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.published, false));
    
    // 分类数量
    const totalCategories = await db.select({ count: count() }).from(categories);
    
    // 标签数量
    const totalTags = await db.select({ count: count() }).from(tags);
    
    // 最近的文章（包括翻译）
    const recentPosts = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        published: posts.published,
        createdAt: posts.createdAt,
        publishedAt: posts.publishedAt,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(5);

    // 为每篇文章获取翻译
    const recentPostsWithTranslations = await Promise.all(
      recentPosts.map(async (post) => {
        const translations = await db
          .select({
            locale: postTranslations.locale,
            title: postTranslations.title,
          })
          .from(postTranslations)
          .where(eq(postTranslations.postId, post.id));

        return {
          ...post,
          translations,
        };
      })
    );

    return {
      success: true,
      data: {
        totalPosts: totalPosts[0]?.count || 0,
        publishedPosts: publishedPosts[0]?.count || 0,
        draftPosts: draftPosts[0]?.count || 0,
        totalCategories: totalCategories[0]?.count || 0,
        totalTags: totalTags[0]?.count || 0,
        recentPosts: recentPostsWithTranslations,
      },
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { success: false, error: 'Failed to get dashboard stats' };
  }
}