import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* 页面标题骨架 */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* 筛选器骨架 */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* 文章列表骨架 */}
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
        <div className="min-w-full">
          {/* 表头骨架 */}
          <div className="bg-zinc-50 dark:bg-zinc-800 px-6 py-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* 表格行骨架 */}
          <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}