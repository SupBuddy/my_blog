import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAdminPosts } from "@/actions/admin-post";
import { getCategories } from "@/actions/admin-category";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PostFilters } from "@/components/admin/PostFilters";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: {
    categoryId?: string;
    published?: string;
  };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 解析筛选参数 - 防止 NaN 问题
  const categoryId = searchParams.categoryId
    ? (() => {
        const parsed = parseInt(searchParams.categoryId);
        return isNaN(parsed) ? undefined : parsed;
      })()
    : undefined;

  const published = searchParams.published
    ? searchParams.published === "true"
    : undefined;

  const filters = {
    categoryId,
    published,
  };

  // 获取文章列表和分类列表
  const { success, data: posts } = await getAdminPosts("zh", filters);
  const { success: categoriesSuccess, data: categoriesData } =
    await getCategories("zh");

  // 准备分类列表（用于筛选器）
  const categories =
    categoriesSuccess && categoriesData
      ? categoriesData.map((cat) => {
          const zhTrans = cat.translations.find((t) => t.locale === "zh");
          return {
            id: cat.id,
            name: zhTrans?.name || cat.slug,
          };
        })
      : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            文章管理
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            管理所有文章内容
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新建文章
          </Button>
        </Link>
      </div>

      {/* 筛选器 - 始终显示 */}
      <PostFilters categories={categories} />

      {!success || !posts || posts.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">
            {filters.categoryId || filters.published !== undefined
              ? "没有符合条件的文章"
              : "暂无文章"}
          </p>
          {!filters.categoryId && filters.published === undefined && (
            <Link href="/dashboard/posts/new" className="mt-4 inline-block">
              <Button>创建第一篇文章</Button>
            </Link>
          )}
        </div>
      ) : (
        /* 文章列表 */
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {post.title}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {post.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-900 dark:text-zinc-100">
                      {post.category?.name || "未分类"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.published
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {post.published ? "已发布" : "草稿"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                    {post.createdAt ? formatDate(post.createdAt) : "未知"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <Link href={`/dashboard/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <form
                      action={`/dashboard/posts/${post.id}`}
                      className="inline"
                      method="POST"
                    >
                      <Button variant="ghost" size="sm" type="submit">
                        {post.published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </form>
                    <form
                      action={`/dashboard/posts/${post.id}`}
                      className="inline"
                      method="POST"
                    >
                      <input type="hidden" name="_method" value="DELETE" />
                      <Button variant="ghost" size="sm" type="submit">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
