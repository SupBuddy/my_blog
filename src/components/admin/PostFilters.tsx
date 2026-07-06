"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface PostFiltersProps {
  categories: Category[];
}

export function PostFilters({ categories }: PostFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 URL 参数读取当前筛选值
  const initialCategoryId = searchParams.get("categoryId");
  const initialPublished = searchParams.get("published");

  const [categoryId, setCategoryId] = useState<string>(
    initialCategoryId || "all",
  );
  const [published, setPublished] = useState<string>(initialPublished || "all");

  // 应用筛选 - 使用 useCallback 稳定函数引用
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (categoryId !== "all") {
      params.set("categoryId", categoryId);
    }

    if (published !== "all") {
      params.set("published", published);
    }

    // 更新 URL 参数
    const queryString = params.toString();
    router.push(`/dashboard/posts${queryString ? `?${queryString}` : ""}`);
  }, [categoryId, published, router]);

  // 清除筛选
  const clearFilters = () => {
    setCategoryId("all");
    setPublished("all");
    router.push("/dashboard/posts");
  };

  // 当筛选值改变时自动应用
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const hasFilters = categoryId !== "all" || published !== "all";

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-zinc-500" />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          筛选:
        </span>
      </div>

      {/* 分类筛选 */}
      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">所有分类</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 状态筛选 */}
      <Select value={published} onValueChange={setPublished}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="选择状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">所有状态</SelectItem>
          <SelectItem value="true">已发布</SelectItem>
          <SelectItem value="false">草稿</SelectItem>
        </SelectContent>
      </Select>

      {/* 清除筛选按钮 */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="w-4 h-4 mr-1" />
          清除筛选
        </Button>
      )}
    </div>
  );
}
