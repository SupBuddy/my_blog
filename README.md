# My Blog - 现代化全栈博客系统

一个基于 Next.js 14+ 构建的现代化全栈博客系统，支持中英双语、暗黑模式、富文本编辑和完整的后台管理功能。

## ✨ 功能特性

### 🎯 前台展示

- **文章列表页**：响应式网格布局，GSAP 动画入场效果
- **文章详情页**：Prose 样式排版，TOC 侧边栏（自动提取标题 + 滚动高亮）
- **多语言支持**：中英双语切换（`/zh` 和 `/en`）
- **响应式设计**：完美适配移动端、平板、桌面端
- **暗黑模式**：无闪烁切换，支持系统主题跟随
- **动态 SEO**：自动生成 Title、Description 和 OG 社交分享卡片

### 🔧 后台管理

- **文章管理**：创建、编辑、删除，发布/草稿状态切换
- **分类管理**：多语言分类 CRUD
- **标签管理**：多语言标签 CRUD，文章-标签多对多关联
- **富文本编辑器**：TipTap 编辑器，支持标题、列表、引用、代码块等
- **Dashboard**：统计数据展示（文章、分类、标签数量）
- **认证保护**：Clerk 身份认证，Middleware 路由保护

### 🛠️ 技术亮点

- **Server Components**：React Server Components + Client Components 混合渲染
- **Server Actions**：数据突变全面使用 Server Actions，告别 API 路由
- **Drizzle ORM**：类型安全的数据库交互
- **shadcn/ui**：基于 Radix UI 的无头组件库，极致定制化
- **GSAP 动画**：视差滚动和列表入场动画
- **代码块组件**：一键复制、语言标识、语法高亮（Shiki）

---

## 🚀 技术栈

### 核心框架

- **Next.js 14+** (App Router)
- **TypeScript** (严格模式)
- **React 18+**

### UI & 样式

- **Tailwind CSS** (原子化 CSS)
- **shadcn/ui** (无头组件库)
- **GSAP** (动画引擎)
- **next-themes** (主题管理)
- **Lucide React** (图标库)

### 数据层

- **Drizzle ORM** (类型安全 ORM)
- **PostgreSQL** (Neon Serverless Database)

### 认证 & 安全

- **Clerk** (身份认证)
- **Middleware** (路由保护)

### 富文本编辑

- **TipTap** (块级富文本编辑器)
- **Shiki** (代码语法高亮)

### 部署

- **Vercel** (零配置 CI/CD)

---

## 📦 安装与运行

### 1. 克隆项目

```bash
git clone https://github.com/SupBuddy/my_blog.git
cd my_blog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件并添加以下环境变量：

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 4. 推送数据库 Schema

```bash
npm run db:push
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问：

- **中文首页**：http://localhost:3000/zh
- **英文首页**：http://localhost:3000/en
- **后台管理**：http://localhost:3000/dashboard

---

## 🗂️ 项目结构

```text
src/
├── app/
│   ├── (front)/              # 前台路由组
│   │   └── [locale]/         # 多语言路由
│   │       ├── page.tsx      # 首页
│   │       └── post/[slug]/  # 文章详情页
│   ├── (admin)/              # 后台路由组
│   │   └── dashboard/        # 后台管理
│   │       ├── posts/        # 文章管理
│   │       ├── categories/   # 分类管理
│   │       └── tags/         # 标签管理
│   ├── sign-in/              # 登录页
│   ├── sign-up/              # 注册页
│   └── layout.tsx            # 根布局
│
├── components/
│   ├── ui/                   # shadcn/ui 组件
│   ├── shared/               # 前后台公用组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── PostCard.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── CodeBlock.tsx
│   └── admin/                # 后台专用组件
│       ├── TipTapEditor.tsx
│       └── EditPostForm.tsx
│
├── actions/                  # Server Actions
│   ├── post.ts               # 文章查询 Actions
│   ├── admin-post.ts         # 文章管理 Actions
│   ├── admin-category.ts     # 分类管理 Actions
│   ├── dashboard.ts          # 统计数据 Actions
│
├── lib/                      # 工具函数
│   ├── db.ts                 # 数据库连接
│   ├── schema.ts             # Drizzle Schema
│   ├── types.ts              # TypeScript 类型定义
│   └── utils.ts              # 通用工具函数
│
└── hooks/                    # React Hooks
    └── useGSAPAnimations.tsx # GSAP 动画 Hook
```

---

## 🌐 部署到 Vercel

### 1. 推送到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. 在 Vercel 导入项目

访问 [Vercel Dashboard](https://vercel.com/dashboard)，点击 "Add New Project"，选择您的 GitHub 仓库。

### 3. 配置环境变量

在 Vercel Settings → Environment Variables 中添加：

```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 4. 部署

点击 "Deploy"，等待 2-5 分钟完成部署。

### 5. 配置 Clerk 生产环境

访问 [Clerk Dashboard](https://dashboard.clerk.com/)：

1. 创建生产实例（Clone development instance）
2. 更新 Vercel 环境变量为生产密钥（`pk_live_...` 和 `sk_live_...`）
3. 配置 Allowed Redirect URLs

详细部署指南：[docs/deployment-guide.md](docs/deployment-guide.md)

---

## 📖 文档

- [技术架构文档](docs/architecture.md)
- [设计系统规范](docs/design-system.md)
- [部署指南](docs/deployment-guide.md)
- [测试指南](docs/testing-guide.md)
- [图片上传功能指南](docs/image-upload-guide.md)

---

## 🔗 快速链接

- **演示站点**：https://my-blog-iota-seven-36.vercel.app
- **GitHub 仓库**：https://github.com/SupBuddy/my_blog

---

## 📄 License

MIT License

---

## 👨‍💻 作者

由 [Your Name](https://github.com/SupBuddy) 开发维护。

如有问题或建议，欢迎提交 Issue 或 Pull Request！
