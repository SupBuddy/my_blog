"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/actions/admin-category";
import { Save } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    translations: {
      zh: { name: "" },
      en: { name: "" },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createCategory({
        slug: formData.slug,
        translations: [
          {
            locale: "zh",
            name: formData.translations.zh.name,
          },
          {
            locale: "en",
            name: formData.translations.en.name,
          },
        ],
      });

      if (result.success) {
        router.push("/dashboard/categories");
        router.refresh();
      } else {
        alert("创建失败：" + result.error);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("创建失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          创建新分类
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          填写分类信息，支持中英双语
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            分类 Slug（URL 路径）
          </label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="例如: technology, lifestyle, tutorials"
            required
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Slug 是分类的唯一标识符，用于 URL 中，建议使用英文小写字母和连字符
          </p>
        </div>

        {/* 中文名称 */}
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            中文版本
          </h2>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              分类名称
            </label>
            <Input
              value={formData.translations.zh.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  translations: {
                    ...formData.translations,
                    zh: { name: e.target.value },
                  },
                })
              }
              placeholder="例如: 技术、生活、教程"
              required
            />
          </div>
        </div>

        {/* 英文名称 */}
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            英文版本
          </h2>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Category Name
            </label>
            <Input
              value={formData.translations.en.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  translations: {
                    ...formData.translations,
                    en: { name: e.target.value },
                  },
                })
              }
              placeholder="e.g., Technology, Lifestyle, Tutorials"
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "保存中..." : "保存分类"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/categories")}
          >
            取消
          </Button>
        </div>
      </form>
    </div>
  );
}