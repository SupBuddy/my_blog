# 图片上传功能实现指南

## 技术方案选择

您的博客项目可以选择以下两种主流的图片存储方案：

### 方案 1: Vercel Blob（推荐）

**优势**：
- 与 Vercel 平台无缝集成
- 零配置部署
- 自动 CDN 加速
- 免费额度：每月 2GB 存储 + 100GB 流量

**劣势**：
- 需要付费计划才能获得更多存储空间
- 仅适用于 Vercel 部署

**实现步骤**：

1. **安装依赖**：
```bash
npm install @vercel/blob
```

2. **配置环境变量**：
在 `.env.local` 中添加：
```
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"
```

从 Vercel Dashboard 获取 token：https://vercel.com/dashboard

3. **创建上传 Server Action**：
```typescript
// src/actions/upload.ts
'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Only images are allowed' };
  }

  // 验证文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'File size must be less than 5MB' };
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
    });

    revalidatePath('/dashboard');
    
    return { success: true, url: blob.url };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}
```

4. **创建上传组件**：
```typescript
// src/components/admin/ImageUpload.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/actions/upload";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

export function ImageUpload({ onUploadComplete, currentImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError("Only images are allowed");
      return;
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImage(formData);

      if (result.success && result.url) {
        setPreviewUrl(result.url);
        onUploadComplete(result.url);
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl("");
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 cursor-pointer flex items-center justify-center bg-zinc-50 dark:bg-zinc-900"
        >
          <div className="text-center">
            <ImageIcon className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-500">
              {isUploading ? "Uploading..." : "Click to upload image"}
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
}
```

5. **在文章创建页集成**：
在 `src/app/(admin)/dashboard/posts/new/page.tsx` 中添加：
```typescript
import { ImageUpload } from "@/components/admin/ImageUpload";

// 在 formData 中添加：
const [formData, setFormData] = useState({
  slug: "",
  coverImage: "",
  categoryId: "",
  tagIds: [] as number[],
  translations: { ... }
});

// 在表单中添加：
<div>
  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
    文章封面图
  </label>
  <ImageUpload
    onUploadComplete={(url) => setFormData({ ...formData, coverImage: url })}
    currentImage={formData.coverImage}
  />
</div>
```

### 方案 2: Cloudflare R2

**优势**：
- 更便宜的存储成本
- 不依赖 Vercel 平台
- 免费额度更大（10GB 存储 + 每月 10M 次读取）

**劣势**：
- 需要额外配置
- 不与 Vercel 自动集成

**实现步骤**（简化版）：

1. 安装 AWS S3 客户端：
```bash
npm install @aws-sdk/client-s3
```

2. 配置环境变量：
```
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_access_key"
R2_SECRET_ACCESS_KEY="your_secret_key"
R2_BUCKET_NAME="your_bucket_name"
```

3. 创建上传 Server Action（类似 Vercel Blob，使用 S3 SDK）

---

## TipTap 编辑器图片上传

如果需要在 TipTap 编辑器中直接上传图片，需要扩展编辑器：

```typescript
// src/components/admin/TipTapEditor.tsx
import { uploadImage } from "@/actions/upload";

// 在 TipTap 配置中添加图片扩展：
import Image from "@tiptap/extension-image";

const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: "rounded-lg max-w-full",
      },
    }),
    Placeholder.configure({ placeholder: "Write something..." }),
  ],
  content: initialContent,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  },
});

// 添加图片上传按钮：
<Button
  variant="ghost"
  size="sm"
  onClick={async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const result = await uploadImage(formData);
        if (result.success && result.url) {
          editor.chain().focus().setImage({ src: result.url }).run();
        }
      }
    };
    input.click();
  }}
>
  <ImageIcon className="w-4 h-4" />
</Button>
```

---

## 部署注意事项

### Vercel 部署

1. 在 Vercel Dashboard 创建 Blob Store
2. 获取 `BLOB_READ_WRITE_TOKEN`
3. 在 Vercel 项目设置中添加环境变量
4. 部署时自动集成

### 其他平台部署

如果部署到其他平台（如 AWS、Cloudflare Pages），建议使用 Cloudflare R2 或 AWS S3。

---

## 安全建议

1. **文件类型验证**：只允许 `image/*` 类型
2. **文件大小限制**：建议限制为 5MB
3. **文件名处理**：使用 UUID 或时间戳避免冲突
4. **访问控制**：公开图片使用 `public` 访问级别

---

## 下一步

由于图片上传功能涉及云存储服务配置和可能的费用，建议您：

1. **选择方案**：决定使用 Vercel Blob 或 Cloudflare R2
2. **获取凭证**：从相应平台获取 API Token
3. **配置环境变量**：添加到 `.env.local`
4. **通知我继续开发**：我会根据您的选择完成具体实现

您希望使用哪种方案？