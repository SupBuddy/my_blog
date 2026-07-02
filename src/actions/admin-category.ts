"use server";

import { db } from "@/db";
import {
  categories,
  categoryTranslations,
  tags,
  tagTranslations,
  postsToTags,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Locale } from "@/lib/types";

// ========== 分类管理 ==========

// 创建分类
export async function createCategory(data: {
  slug: string;
  translations: {
    locale: Locale;
    name: string;
  }[];
}) {
  try {
    const newCategory = await db
      .insert(categories)
      .values({
        slug: data.slug,
      })
      .returning();

    const categoryId = newCategory[0].id;

    for (const translation of data.translations) {
      await db.insert(categoryTranslations).values({
        categoryId,
        locale: translation.locale,
        name: translation.name,
      });
    }

    revalidatePath("/dashboard/categories");

    return { success: true, data: newCategory[0] };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

// 更新分类
export async function updateCategory(
  categoryId: number,
  data: {
    slug?: string;
    translations?: {
      locale: Locale;
      name: string;
    }[];
  },
) {
  try {
    if (data.slug) {
      await db
        .update(categories)
        .set({ slug: data.slug })
        .where(eq(categories.id, categoryId));
    }

    if (data.translations) {
      for (const translation of data.translations) {
        const existing = await db
          .select()
          .from(categoryTranslations)
          .where(
            and(
              eq(categoryTranslations.categoryId, categoryId),
              eq(categoryTranslations.locale, translation.locale),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(categoryTranslations)
            .set({ name: translation.name })
            .where(eq(categoryTranslations.id, existing[0].id));
        } else {
          await db.insert(categoryTranslations).values({
            categoryId,
            locale: translation.locale,
            name: translation.name,
          });
        }
      }
    }

    revalidatePath("/dashboard/categories");

    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

// 删除分类
export async function deleteCategory(categoryId: number) {
  try {
    await db
      .delete(categoryTranslations)
      .where(eq(categoryTranslations.categoryId, categoryId));
    await db.delete(categories).where(eq(categories.id, categoryId));

    revalidatePath("/dashboard/categories");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// 获取所有分类
export async function getCategories(locale: Locale = "zh") {
  try {
    const allCategories = await db.select().from(categories);

    const categoriesWithTranslations = [];

    for (const category of allCategories) {
      const translations = await db
        .select()
        .from(categoryTranslations)
        .where(eq(categoryTranslations.categoryId, category.id));

      categoriesWithTranslations.push({
        ...category,
        translations: translations.map((t) => ({
          locale: t.locale,
          name: t.name,
        })),
      });
    }

    return { success: true, data: categoriesWithTranslations };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// ========== 标签管理 ==========

// 创建标签
export async function createTag(data: {
  slug: string;
  translations: {
    locale: Locale;
    name: string;
  }[];
}) {
  try {
    const newTag = await db
      .insert(tags)
      .values({
        slug: data.slug,
      })
      .returning();

    const tagId = newTag[0].id;

    for (const translation of data.translations) {
      await db.insert(tagTranslations).values({
        tagId,
        locale: translation.locale,
        name: translation.name,
      });
    }

    revalidatePath("/dashboard/tags");

    return { success: true, data: newTag[0] };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { success: false, error: "Failed to create tag" };
  }
}

// 更新标签
export async function updateTag(
  tagId: number,
  data: {
    slug?: string;
    translations?: {
      locale: Locale;
      name: string;
    }[];
  },
) {
  try {
    if (data.slug) {
      await db.update(tags).set({ slug: data.slug }).where(eq(tags.id, tagId));
    }

    if (data.translations) {
      for (const translation of data.translations) {
        const existing = await db
          .select()
          .from(tagTranslations)
          .where(
            and(
              eq(tagTranslations.tagId, tagId),
              eq(tagTranslations.locale, translation.locale),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(tagTranslations)
            .set({ name: translation.name })
            .where(eq(tagTranslations.id, existing[0].id));
        } else {
          await db.insert(tagTranslations).values({
            tagId,
            locale: translation.locale,
            name: translation.name,
          });
        }
      }
    }

    revalidatePath("/dashboard/tags");

    return { success: true };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

// 删除标签
export async function deleteTag(tagId: number) {
  try {
    await db.delete(tagTranslations).where(eq(tagTranslations.tagId, tagId));
    await db.delete(postsToTags).where(eq(postsToTags.tagId, tagId));
    await db.delete(tags).where(eq(tags.id, tagId));

    revalidatePath("/dashboard/tags");

    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}

// 获取所有标签
export async function getTags(locale: Locale = "zh") {
  try {
    const allTags = await db.select().from(tags);

    const tagsWithTranslations = [];

    for (const tag of allTags) {
      const translations = await db
        .select()
        .from(tagTranslations)
        .where(eq(tagTranslations.tagId, tag.id));

      tagsWithTranslations.push({
        ...tag,
        translations: translations.map((t) => ({
          locale: t.locale,
          name: t.name,
        })),
      });
    }

    return { success: true, data: tagsWithTranslations };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { success: false, error: "Failed to fetch tags" };
  }
}
