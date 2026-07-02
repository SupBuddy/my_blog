# 现代全栈博客系统技术架构文档 (Architecture Blueprint)

## 1. 项目概述

本项目是一个基于 Next.js App Router 架构的现代化全栈博客系统。采用前后端同构开发模式，结合 Serverless 数据库与边缘计算部署，旨在提供极致的访问性能与丝滑的用户交互体验。项目包含完整的后台管理工作流、富文本编辑、中英双语支持以及动态 SEO 优化。

## 2. 技术栈选型 (Tech Stack)

### 2.1 核心框架与语言

- **核心框架:** Next.js 14+ (App Router)
- **编程语言:** TypeScript (提供全链路严格类型安全)
- **前端库:** React 18+ (使用 Server Components 与 Client Components 混合渲染)

### 2.2 样式与 UI

- **CSS 框架:** Tailwind CSS (原子化 CSS)
- **组件库:** shadcn/ui (无头组件库，基于 Radix UI，极致定制化)
- **动画引擎:** GSAP (处理首页复杂的滚动与过渡动画)
- **主题管理:** next-themes (支持无闪烁的明暗/暗黑模式切换)

### 2.3 数据层 (Database & ORM)

- **数据库:** Neon / Supabase (Serverless PostgreSQL，提供极速响应与免费沙盒集群)
- **ORM:** Prisma / Drizzle ORM (类型安全的数据库交互与 Schema 管理)
- **存储服务:** Vercel Blob / Cloudflare R2 (通过预签名 URL 实现图片直传，不占用应用服务器带宽)

### 2.4 鉴权与安全 (Authentication & Security)

- **身份认证:** Clerk / NextAuth.js
- **权限控制:** 基于中间件 (Next.js Middleware) 实现路由级别的后台访问拦截

### 2.5 部署与运维 (Deployment)

- **托管平台:** Vercel (零配置 CI/CD，自动处理边缘节点缓存)

---

## 3. 核心功能模块 (Core Modules)

### 3.1 前台展示模块 (Client Facing)

- **文章列表页:** 采用瀑布流或网格布局，支持基于游标 (Cursor-based) 的分页加载。结合 GSAP 实现视差滚动与元素入场动画。
- **文章详情页:**
  - MDX / 富文本渲染引擎，支持复杂排版。
  - **侧边栏 TOC:** 自动提取标题生成动态目录树，支持滚动高亮监听。
  - **代码高亮:** 使用 Shiki/Prism.js 实现语法高亮，并内置“一键复制”功能。
- **多语言切换 (i18n):** 无缝切换中英双语内容与 UI 界面。
- **响应式设计:** 完美适配移动端、平板与桌面端显示。

### 3.2 后台管理模块 (Admin Dashboard)

- **鉴权登录:** 仅限系统创建者 (Admin) 登录后台。
- **内容管理 (CRUD):**
  - 支持文章的新建、编辑、删除。
  - 支持 **发布 (Published)** 与 **草稿 (Draft)** 状态切换。
  - 支持为文章配置封面图、多语言标题、分类 (Category) 与标签 (Tags)。
- **富文本编辑器:** 集成 Novel / TipTap 块级富文本编辑器，提供类似 Notion 的丝滑写作体验。
- **媒体管理:** 支持在编辑器中直接拖拽上传图片至云存储对象桶。

### 3.3 系统层功能

- **动态 SEO:** 结合 Next.js `generateMetadata` API，根据文章内容自动生成 Title、Description 以及 Open Graph (OG) 社交分享卡片。
- **Server Actions:** 表单提交与数据库交互全面采用 Server Actions，告别传统的 API 路由编写，提升开发效率与安全性。

---

## 4. 数据库架构概览 (Database Schema)

系统采用关系型数据库设计，支持多语言 (i18n) 数据落地。核心实体关系如下：

- **User (用户表):** 存储作者信息与权限角色。
- **Post (文章主表):** 存储文章元数据（状态、封面图、关联分类）。
- **PostTranslation (多语言从表):** 针对不同 Locale (zh/en) 存储独立的标题和正文内容（如果采用独立翻译表方案）。
- **Category (分类表):** 一对多关联至 Post 表。
- **Tag (标签表):** 通过连接表 `PostToTag` 与 Post 表建立多对多关系。

---

## 5. 项目目录结构规划 (Folder Structure)

```text
├── app/
│   ├── (front)/           # 前台路由组 (无需登录即可访问)
│   │   ├── [locale]/      # i18n 动态路由拦截
│   │   │   ├── page.tsx   # 首页 (文章列表 + GSAP 动画)
│   │   │   └── post/
│   │   │       └── [slug]/page.tsx # 文章详情页
│   ├── (admin)/           # 后台路由组 (鉴权保护)
│   │   └── dashboard/     # 后台管理主页
│   ├── api/               # 如果有无法使用 Server Actions 的特殊接口 (如 Webhook)
│   └── layout.tsx         # 全局根布局 (注入 ThemeProvider, i18n Context)
├── components/
│   ├── ui/                # shadcn/ui 基础组件
│   ├── editor/            # 富文本编辑器组件封装
│   └── shared/            # 前后台公用的业务组件 (如 Header, Footer, SEO)
├── lib/                   # 工具函数 (日期格式化、图床直传逻辑、GSAP 注册等)
├── db/                    # 数据库相关代码
│   ├── schema.ts          # ORM 表结构定义
│   └── index.ts           # 数据库连接实例
├── actions/               # 存放所有的 Server Actions (服务端数据库交互逻辑)
└── public/                # 静态资源 (Logo, 默认头像等)
```
