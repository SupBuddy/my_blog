/**
 * 缓存配置和辅助函数
 * 使用 Next.js unstable_cache API 缓存数据库查询结果
 */

import { unstable_cache } from "next/cache";

// 缓存标签常量 - 用于精确控制缓存失效
export const CACHE_TAGS = {
  POSTS: "posts",
  POSTS_ADMIN: "posts-admin",
  CATEGORIES: "categories",
  TAGS: "tags",
  POST_DETAIL: "post-detail",
} as const;

// 缓存时间配置（秒）
export const CACHE_TIMES = {
  // 分类和标签变化较少，缓存时间较长
  CATEGORIES: 300, // 5 分钟
  TAGS: 300, // 5 分钟

  // 文章列表变化适中，缓存时间适中
  POSTS_LIST: 120, // 2 分钟
  POSTS_ADMIN: 60, // 1 分钟（后台需要更及时的数据）

  // 文章详情变化较少，缓存时间较长
  POST_DETAIL: 180, // 3 分钟
} as const;

/**
 * 创建缓存查询函数的辅助函数
 * @param queryFn 查询函数
 * @param keys 缓存键数组
 * @param tags 缓存标签数组
 * @param revalidate 重新验证时间（秒）
 */
export function createCachedQuery<T extends (...args: any[]) => any>(
  queryFn: T,
  keys: string[],
  tags: string[],
  revalidate: number = 60,
): T {
  return unstable_cache(queryFn, keys, {
    tags,
    revalidate,
  }) as T;
}