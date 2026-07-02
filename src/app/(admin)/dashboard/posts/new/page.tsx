"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TipTapEditor } from "@/components/admin/TipTapEditor";
import { createPost } from "@/actions/admin-post";
import { getCategories, getTags } from "@/actions/admin-category";
import { Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: number;
  slug: string;
  translations: Array<{ locale: string; name: string }>;
}

interface Tag {
  id: number;
  slug: string;
  translations: Array<{ locale: string; name: string }>;
}

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState({
    slug: "",
    categoryId: "",
    tagIds: [] as number[],
    translations: {
      zh: { title: "", content: "", excerpt: "" },
      en: { title: "", content: "", excerpt: "" },
    },
  });

  // 加载分类和标签
  useEffect(() => {
    async function loadData() {
      const categoriesResult = await getCategories("zh");
      const tagsResult = await getTags("zh");

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data);
      }

      if (tagsResult.success && tagsResult.data) {
        setTags(tagsResult.data);
      }
    }

    loadData();
  }, []);

  const handleTagToggle = (tagId: number) => {
    setFormData((prev) => {
      const newTagIds = prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId];
      return { ...prev, tagIds: newTagIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createPost({
        slug: formData.slug,
        categoryId: formData.categoryId
          ? parseInt(formData.categoryId)
          : undefined,
        tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined,
        translations: [
          {
            locale: "zh",
            title: formData.translations.zh.title,
            content: formData.translations.zh.content,
            excerpt: formData.translations.zh.excerpt,
          },
          {
            locale: "en",
            title: formData.translations.en.title,
            content: formData.translations.en.content,
            excerpt: formData.translations.en.excerpt,
          },
        ],
      });

      if (result.success) {
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        alert("创建失败：" + result.error);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("创建失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          创建新文章
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          填写文章信息并保存为草稿
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            文章 Slug（URL 路径）
          </label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="例如: getting-started-with-nextjs"
            required
          />
        </div>

        {/* 分类选择 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            文章分类
          </label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择分类（可选）" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => {
                const zhName = category.translations.find(t => t.locale === "zh")?.name || category.slug;
                return (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {zhName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* 标签选择 */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            文章标签（可多选）
          </label>
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
            {tags.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">暂无可用标签</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const zhName = tag.translations.find(t => t.locale === "zh")?.name || tag.slug;
                  const isSelected = formData.tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        isSelected
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                      }`}
                    >
                      {zhName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 中文内容 */}
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            中文版本
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                标题
              </label>
              <Input
                value={formData.translations.zh.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      zh: {
                        ...formData.translations.zh,
                        title: e.target.value,
                      },
                    },
                  })
                }
                placeholder="文章标题"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                摘要
              </label>
              <Input
                value={formData.translations.zh.excerpt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      zh: {
                        ...formData.translations.zh,
                        excerpt: e.target.value,
                      },
                    },
                  })
                }
                placeholder="文章摘要（可选）"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                内容
              </label>
              <TipTapEditor
                content={formData.translations.zh.content}
                onChange={(content) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      zh: { ...formData.translations.zh, content },
                    },
                  })
                }
                placeholder="开始编写文章内容..."
              />
            </div>
          </div>
        </div>

        {/* 英文内容 */}
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 bg-white dark:bg-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            英文版本
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Title
              </label>
              <Input
                value={formData.translations.en.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      en: {
                        ...formData.translations.en,
                        title: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Post Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Excerpt
              </label>
              <Input
                value={formData.translations.en.excerpt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      en: {
                        ...formData.translations.en,
                        excerpt: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Post excerpt (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Content
              </label>
              <TipTapEditor
                content={formData.translations.en.content}
                onChange={(content) =>
                  setFormData({
                    ...formData,
                    translations: {
                      ...formData.translations,
                      en: { ...formData.translations.en, content },
                    },
                  })
                }
                placeholder="Start writing your post content..."
              />
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "保存中..." : "保存为草稿"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/posts")}
          >
            取消
          </Button>
        </div>
      </form>
    </div>
  );
}
