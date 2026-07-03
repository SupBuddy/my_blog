import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PostWithTranslations, Locale } from "@/lib/types";

interface PostCardProps {
  post: PostWithTranslations;
  locale: Locale;
}

export function PostCard({ post, locale }: PostCardProps) {
  // 获取当前语言的翻译
  const translation =
    post.translations.find((t) => t.locale === locale) || post.translations[0];
  const categoryTrans = post.category?.translations.find(
    (t) => t.locale === locale,
  );

  return (
    <article className="group">
      <Link href={`/${locale}/post/${post.slug}`}>
        {post.coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={post.coverImage}
              alt={translation.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="mt-4 space-y-2">
          {categoryTrans && (
            <span className="inline-block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {categoryTrans.name}
            </span>
          )}

          <h2 className="text-xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
            {translation.title}
          </h2>

          {translation.excerpt && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {translation.excerpt}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            <time>
              {post.publishedAt
                ? formatDate(post.publishedAt)
                : post.createdAt
                  ? formatDate(post.createdAt)
                  : "Draft"}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
