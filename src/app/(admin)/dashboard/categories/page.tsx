import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/actions/admin-category";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function CategoriesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { success, data: categories } = await getCategories("zh");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            分类管理
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            管理文章分类，支持多语言
          </p>
        </div>
        <Link href="/dashboard/categories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新建分类
          </Button>
        </Link>
      </div>

      {!success || !categories || categories.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">暂无分类</p>
          <Link href="/dashboard/categories/new" className="mt-4 inline-block">
            <Button>创建第一个分类</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  中文名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  英文名称
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
              {categories.map((category) => {
                const zhTranslation = category.translations.find(
                  (t) => t.locale === "zh",
                );
                const enTranslation = category.translations.find(
                  (t) => t.locale === "en",
                );

                return (
                  <tr
                    key={category.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">
                        {zhTranslation?.name || "未设置"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">
                        {enTranslation?.name || "未设置"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {category.createdAt
                        ? formatDate(category.createdAt)
                        : "未知"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <Link href={`/dashboard/categories/${category.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <form
                        action={`/dashboard/categories/${category.id}`}
                        className="inline"
                        method="POST"
                      >
                        <Button variant="ghost" size="sm" type="submit">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
