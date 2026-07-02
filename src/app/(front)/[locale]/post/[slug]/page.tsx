import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { getPostBySlug } from "@/actions/post";
import type { Locale } from "@/lib/types";

interface PostPageProps {
  params: { locale: Locale; slug: string };
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: "Not Found",
    };
  }

  const translation =
    post.translations.find((t) => t.locale === locale) || post.translations[0];

  return {
    title: translation.title,
    description: translation.excerpt || translation.title,
    openGraph: {
      title: translation.title,
      description: translation.excerpt || translation.title,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["Author"],
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const translation =
    post.translations.find((t) => t.locale === locale) || post.translations[0];
  const categoryTrans = post.category?.translations.find(
    (t) => t.locale === locale,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />

      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          {/* 文章头部 */}
          <header className="mb-12 space-y-6">
            {post.coverImage && (
              <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={post.coverImage}
                  alt={translation.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  priority
                />
              </div>
            )}

            {categoryTrans && (
              <span className="inline-block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {categoryTrans.name}
              </span>
            )}

            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
              {translation.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
              <time>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(
                      locale === "zh" ? "zh-CN" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "Draft"}
              </time>
              <span>·</span>
              <span>5 min read</span>
            </div>
          </header>

          {/* 文章内容 - 使用 prose 样式 */}
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: translation.content }} />
          </div>

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <footer className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => {
                  const tagTrans = tag.translations.find(
                    (t) => t.locale === locale,
                  );
                  return (
                    <span
                      key={tag.id}
                      className="inline-flex items-center rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                    >
                      {tagTrans?.name || tag.slug}
                    </span>
                  );
                })}
              </div>
            </footer>
          )}
        </article>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
