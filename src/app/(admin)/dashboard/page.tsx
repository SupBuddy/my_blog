import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getDashboardStats } from "@/actions/dashboard";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const { success, data: stats } = await getDashboardStats();

  if (!success || !stats) {
    return (
      <div className="text-zinc-600 dark:text-zinc-400">
        Failed to load dashboard statistics.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome back, {user?.firstName || "Admin"}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your blog content from here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Total Posts
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats.totalPosts}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Published
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats.publishedPosts}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Drafts
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats.draftPosts}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Categories
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats.totalCategories}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Tags
          </div>
          <div className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {stats.totalTags}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Recent Posts
        </h2>
        {stats.recentPosts.length === 0 ? (
          <div className="text-zinc-600 dark:text-zinc-400">
            No posts yet. Create your first post to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recentPosts.map((post) => {
              const zhTitle =
                post.translations.find((t) => t.locale === "zh")?.title ||
                "Untitled";
              return (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex-1">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                    >
                      {zhTitle}
                    </Link>
                    <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {post.createdAt
                        ? formatDate(post.createdAt)
                        : "Unknown date"}
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.published
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
