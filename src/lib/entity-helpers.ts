import { db } from "@/db";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Locale } from "@/lib/types";

/**
 * 通用的分类/标签 CRUD 辅助函数
 * 用于减少 admin-category.ts 中的代码重复
 */

interface EntityConfig {
  table: any;
  translationsTable: any;
  idField: string;
  translationsIdField: string;
  revalidatePath: string;
}

// 创建实体（分类或标签）
export async function createEntity(
  config: EntityConfig,
  data: {
    slug: string;
    translations: {
      locale: Locale;
      name: string;
    }[];
  },
) {
  try {
    const newEntity = await db
      .insert(config.table)
      .values({
        slug: data.slug,
      })
      .returning();

    const entityId = (newEntity as any[])[0].id;

    for (const translation of data.translations) {
      await db.insert(config.translationsTable).values({
        [config.translationsIdField]: entityId,
        locale: translation.locale,
        name: translation.name,
      });
    }

    revalidatePath(config.revalidatePath);

    return { success: true, data: (newEntity as any[])[0] };
  } catch (error) {
    console.error(`Error creating ${config.idField}:`, error);
    return { success: false, error: `Failed to create ${config.idField}` };
  }
}

// 更新实体（分类或标签）
export async function updateEntity(
  config: EntityConfig,
  entityId: number,
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
        .update(config.table)
        .set({ slug: data.slug })
        .where(eq(config.table.id, entityId));
    }

    if (data.translations) {
      for (const translation of data.translations) {
        const existing = await db
          .select()
          .from(config.translationsTable)
          .where(
            and(
              eq(
                config.translationsTable[config.translationsIdField],
                entityId,
              ),
              eq(config.translationsTable.locale, translation.locale),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(config.translationsTable)
            .set({ name: translation.name })
            .where(eq(config.translationsTable.id, existing[0].id));
        } else {
          await db.insert(config.translationsTable).values({
            [config.translationsIdField]: entityId,
            locale: translation.locale,
            name: translation.name,
          });
        }
      }
    }

    revalidatePath(config.revalidatePath);

    return { success: true };
  } catch (error) {
    console.error(`Error updating ${config.idField}:`, error);
    return { success: false, error: `Failed to update ${config.idField}` };
  }
}

// 删除实体（分类或标签）
export async function deleteEntity(config: EntityConfig, entityId: number) {
  try {
    await db
      .delete(config.translationsTable)
      .where(
        eq(config.translationsTable[config.translationsIdField], entityId),
      );
    await db.delete(config.table).where(eq(config.table.id, entityId));

    revalidatePath(config.revalidatePath);

    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${config.idField}:`, error);
    return { success: false, error: `Failed to delete ${config.idField}` };
  }
}

// 获取所有实体（分类或标签）
export async function getEntities(config: EntityConfig, locale: Locale = "zh") {
  try {
    const allEntities = await db.select().from(config.table);

    if (allEntities.length === 0) {
      return { success: true, data: [] };
    }

    // 批量查询所有翻译，解决 N+1 查询问题
    const entityIds = allEntities.map((e) => e.id);
    const allTranslations = await db
      .select()
      .from(config.translationsTable)
      .where(
        inArray(
          config.translationsTable[config.translationsIdField],
          entityIds,
        ),
      );

    // 预分组翻译数据，避免嵌套循环
    const translationsMap = new Map<number, any[]>();
    for (const trans of allTranslations) {
      const entityId = trans[config.translationsIdField];
      if (!translationsMap.has(entityId)) {
        translationsMap.set(entityId, []);
      }
      translationsMap.get(entityId)!.push(trans);
    }

    const entitiesWithTranslations = allEntities.map((entity) => ({
      ...entity,
      translations: (translationsMap.get(entity.id) || []).map((t) => ({
        locale: t.locale,
        name: t.name,
      })),
    }));

    return { success: true, data: entitiesWithTranslations };
  } catch (error) {
    console.error(`Error fetching ${config.idField}:`, error);
    return { success: false, error: `Failed to fetch ${config.idField}` };
  }
}
