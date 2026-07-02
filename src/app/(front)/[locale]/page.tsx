import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { PostCard } from "@/components/shared/PostCard";
import { PostListAnimations } from "@/hooks/useGSAPAnimations";
import { getPosts } from "@/actions/post";
import type { Locale } from "@/lib/types";

interface HomePageProps {
  params: { locale: Locale };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = params;
  const { posts } = await getPosts(locale, 12);

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="mb-12 space-y-4 hero-section">
            <h1 className="hero-title text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
              {locale === "zh" ? "欢迎来到我的博客" : "Welcome to My Blog"}
            </h1>
            <p className="hero-description text-lg text-zinc-600 dark:text-zinc-400">
              {locale === "zh"
                ? "探索技术、分享知识、记录成长"
                : "Exploring technology, sharing knowledge, documenting growth"}
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                {locale === "zh"
                  ? "暂无文章，敬请期待..."
                  : "No posts yet, stay tuned..."}
              </p>
            </div>
          ) : (
            <PostListAnimations>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <div key={post.id} className="post-card">
                    <PostCard post={post} locale={locale} />
                  </div>
                ))}
              </div>
            </PostListAnimations>
          )}
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
