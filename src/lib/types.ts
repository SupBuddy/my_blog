// Database types
export * from "@/db/schema";

// Post types
export interface PostWithTranslations {
  id: number;
  slug: string;
  coverImage: string | null;
  published: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  publishedAt: Date | null;
  categoryId: number | null;
  authorId: number | null;
  translations: {
    locale: string;
    title: string;
    content: string;
    excerpt: string | null;
  }[];
  category?: {
    id: number;
    slug: string;
    translations: {
      locale: string;
      name: string;
    }[];
  } | null;
  tags?: {
    id: number;
    slug: string;
    translations: {
      locale: string;
      name: string;
    }[];
  }[];
}

// Translation types
export interface TranslationData {
  locale: string;
  title: string;
  content: string;
  excerpt: string | null;
}

export interface CategoryTranslationData {
  locale: string;
  name: string;
}

export interface TagTranslationData {
  locale: string;
  name: string;
}

// Category and Tag types
export interface CategoryWithTranslations {
  id: number;
  slug: string;
  translations: CategoryTranslationData[];
}

export interface TagWithTranslations {
  id: number;
  slug: string;
  translations: TagTranslationData[];
}

// Post update data type
export interface PostUpdateData {
  slug?: string;
  coverImage?: string;
  categoryId?: number;
  published?: boolean;
  publishedAt?: Date | null;
  updatedAt?: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Locale types
export type Locale = "zh" | "en";
export const locales: Locale[] = ["zh", "en"];
export const defaultLocale: Locale = "zh";
