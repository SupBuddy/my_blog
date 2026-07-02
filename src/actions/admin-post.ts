'use server';

import { db } from '@/db';
import { posts, postTranslations, categories, categoryTranslations, tags, tagTranslations, postsToTags } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { Locale } from '@/lib/types';

// 创建新文章
export async function createPost(data: {
  slug: string;
  coverImage?: string;
  categoryId?: number;
  authorId?: number;
  translations: {
    locale: Locale;
    title: string;
    content: string;
    excerpt?: string;
  }[];
  tagIds?: number[];
}) {
  try {
    // 创建文章主表记录
    const newPost = await db.insert(posts).values({
      slug: data.slug,
      coverImage: data.coverImage || null,
      published: false, // 默认为草稿
      categoryId: data.categoryId || null,
      authorId: data.authorId || null,
    }).returning();

    const postId = newPost[0].id;

    // 创建文章翻译记录
    for (const translation of data.translations) {
      await db.insert(postTranslations).values({
        postId,
        locale: translation.locale,
        title: translation.title,
        content: translation.content,
        excerpt: translation.excerpt || null,
      });
    }

    // 创建文章-标签关联
    if (data.tagIds && data.tagIds.length > 0) {
      for (const tagId of data.tagIds) {
        await db.insert(postsToTags).values({
          postId,
          tagId,
        });
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/zh');
    revalidatePath('/en');

    return { success: true, data: newPost[0] };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}

// 更新文章
export async function updatePost(postId: number, data: {
  slug?: string;
  coverImage?: string;
  categoryId?: number;
  published?: boolean;
  translations?: {
    locale: Locale;
    title: string;
    content: string;
    excerpt?: string;
  }[];
  tagIds?: number[];
}) {
  try {
    // 更新文章主表
    const updateData: any = {};
    if (data.slug) updateData.slug = data.slug;
    if (data.coverImage) updateData.coverImage = data.coverImage;
    if (data.categoryId) updateData.categoryId = data.categoryId;
    if (data.published !== undefined) {
      updateData.published = data.published;
      if (data.published) {
        updateData.publishedAt = new Date();
      }
    }
    updateData.updatedAt = new Date();

    await db.update(posts).set(updateData).where(eq(posts.id, postId));

    // 更新翻译
    if (data.translations) {
      for (const translation of data.translations) {
        const existing = await db
          .select()
          .from(postTranslations)
          .where(and(
            eq(postTranslations.postId, postId),
            eq(postTranslations.locale, translation.locale)
          ))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(postTranslations)
            .set({
              title: translation.title,
              content: translation.content,
              excerpt: translation.excerpt || null,
            })
            .where(eq(postTranslations.id, existing[0].id));
        } else {
          await db.insert(postTranslations).values({
            postId,
            locale: translation.locale,
            title: translation.title,
            content: translation.content,
            excerpt: translation.excerpt || null,
          });
        }
      }
    }

    // 更新标签关联
    if (data.tagIds) {
      // 删除旧的关联
      await db.delete(postsToTags).where(eq(postsToTags.postId, postId));
      
      // 创建新的关联
      for (const tagId of data.tagIds) {
        await db.insert(postsToTags).values({
          postId,
          tagId,
        });
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/zh');
    revalidatePath('/en');

    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

// 删除文章
export async function deletePost(postId: number) {
  try {
    // 删除翻译记录
    await db.delete(postTranslations).where(eq(postTranslations.postId, postId));
    
    // 删除标签关联
    await db.delete(postsToTags).where(eq(postsToTags.postId, postId));
    
    // 删除文章
    await db.delete(posts).where(eq(posts.id, postId));

    revalidatePath('/dashboard');
    revalidatePath('/zh');
    revalidatePath('/en');

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}

// 发布/取消发布文章
export async function togglePostPublishStatus(postId: number, published: boolean) {
  try {
    await db
      .update(posts)
      .set({
        published,
        publishedAt: published ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    revalidatePath('/dashboard');
    revalidatePath('/zh');
    revalidatePath('/en');

    return { success: true };
  } catch (error) {
    console.error('Error toggling post status:', error);
    return { success: false, error: 'Failed to toggle post status' };
  }
}

// 获取后台文章列表（包括草稿）
export async function getAdminPosts(locale: Locale = 'zh') {
  try {
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));

    const postsWithDetails = [];

    for (const post of allPosts) {
      const translations = await db
        .select()
        .from(postTranslations)
        .where(eq(postTranslations.postId, post.id));

      const translation = translations.find(t => t.locale === locale) || translations[0];

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
            name: categoryTrans.find(t => t.locale === locale)?.name || categoryTrans[0]?.name,
          };
        }
      }

      postsWithDetails.push({
        id: post.id,
        slug: post.slug,
        coverImage: post.coverImage,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        publishedAt: post.publishedAt,
        title: translation?.title || 'Untitled',
        excerpt: translation?.excerpt,
        category,
      });
    }

    return { success: true, data: postsWithDetails };
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return { success: false, error: 'Failed to fetch posts' };
  }
}

// 获取单个文章详情（用于编辑）
export async function getAdminPostById(postId: number) {
  try {
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return { success: false, error: 'Post not found' };
    }

    const translations = await db
      .select()
      .from(postTranslations)
      .where(eq(postTranslations.postId, postId));

    const postTags = await db
      .select()
      .from(postsToTags)
      .where(eq(postsToTags.postId, postId));

    const tagIds = postTags.map(pt => pt.tagId);

    return {
      success: true,
      data: {
        ...post[0],
        translations,
        tagIds,
      },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { success: false, error: 'Failed to fetch post' };
  }
}