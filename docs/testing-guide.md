# 测试指南

## 1. 启动开发服务器

运行以下命令启动 Next.js 开发服务器：

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

## 2. 推送数据库 Schema

在测试之前，需要先创建数据库表结构：

```bash
npm run db:push
```

这将根据 `src/db/schema.ts` 创建所有必要的表：
- users
- categories, category_translations
- posts, post_translations
- tags, tag_translations
- posts_to_tags

## 3. 创建测试数据

### 方法 A：使用 Drizzle Studio（推荐）

运行 Drizzle Studio 查看和管理数据库：

```bash
npm run db:studio
```

这将打开 `https://local.drizzle.studio/`，您可以在浏览器中手动添加测试数据。

### 方法 B：使用 SQL 脚本

在 Neon/Supabase 控制台执行以下 SQL：

```sql
-- 创建分类
INSERT INTO categories (slug) VALUES ('technology');
INSERT INTO category_translations (category_id, locale, name) VALUES 
  (1, 'zh', '技术'),
  (1, 'en', 'Technology');

-- 创建标签
INSERT INTO tags (slug) VALUES ('nextjs');
INSERT INTO tag_translations (tag_id, locale, name) VALUES 
  (1, 'zh', 'Next.js'),
  (1, 'en', 'Next.js');

INSERT INTO tags (slug) VALUES ('tutorial');
INSERT INTO tag_translations (tag_id, locale, name) VALUES 
  (2, 'zh', '教程'),
  (2, 'en', 'Tutorial');

-- 创建文章
INSERT INTO posts (slug, cover_image, published, published_at, category_id) VALUES 
  ('getting-started-with-nextjs-14', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', true, NOW(), 1);

INSERT INTO post_translations (post_id, locale, title, content, excerpt) VALUES 
  (1, 'zh', 'Next.js 14 入门指南', '<p>本文将介绍如何使用 Next.js 14 构建现代 Web 应用。</p><h2 id="intro">简介</h2><p>Next.js 是一个强大的 React 框架...</p>', 'Next.js 14 完整入门教程'),
  (1, 'en', 'Getting Started with Next.js 14', '<p>This guide will introduce how to build modern web apps with Next.js 14.</p><h2 id="intro">Introduction</h2><p>Next.js is a powerful React framework...</p>', 'A complete tutorial for Next.js 14');

-- 关联标签
INSERT INTO posts_to_tags (post_id, tag_id) VALUES (1, 1), (1, 2);
```

## 4. 测试功能

### 4.1 测试前台展示模块

访问以下页面验证前台功能：

1. **首页（中文）**：`http://localhost:3000/zh`
   - 验证文章列表显示
   - 验证 GSAP 动画效果（卡片交错入场）
   - 验证主题切换（明暗模式）
   - 验证响应式布局（移动端、平板、桌面）

2. **首页（英文）**：`http://localhost:3000/en`
   - 验证多语言切换

3. **文章详情页**：`http://localhost:3000/zh/post/getting-started-with-nextjs-14`
   - 验证文章内容渲染
   - 验证 Prose 样式排版
   - 验证封面图、分类、标签显示

### 4.2 测试认证系统

1. **登录页面**：`http://localhost:3000/sign-in`
   - 使用 Clerk 测试账号登录
   - 验证登录流程

2. **后台页面**：`http://localhost:3000/dashboard`
   - 验证未登录时的路由保护（自动跳转到登录页）
   - 登录后验证后台布局显示
   - 验证 UserButton 和主题切换

### 4.3 测试数据库连接

创建一个测试 API 路由验证数据库连接：

访问 `http://localhost:3000/api/test-db`（需要先创建此路由）

或者直接在后台页面查看统计数据（虽然目前显示 0，但能验证数据库连接）。

## 5. 验证项目配置

### 5.1 验证环境变量

确保 `.env.local` 包含以下配置：

```bash
DATABASE_URL="your-neon-connection-string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-key"
CLERK_SECRET_KEY="your-clerk-secret"
```

### 5.2 验证 TypeScript 类型安全

运行构建验证类型安全：

```bash
npm run build
```

应该看到 `✓ Linting and checking validity of types` 成功。

## 6. 测试注意事项

- **首次测试**：数据库为空，前台会显示"暂无文章"提示
- **认证测试**：需要在 Clerk Dashboard 创建测试账号或使用开发模式
- **图片测试**：使用 Unsplash 等外部图片 URL，或后续实现图片上传
- **动画测试**：GSAP 动画仅在客户端生效，刷新页面可看到入场效果

## 7. 开发工具推荐

- **Drizzle Studio**：可视化管理数据库（`npm run db:studio`）
- **Clerk Dashboard**：管理用户认证（https://dashboard.clerk.com）
- **Neon Console**：管理数据库（https://console.neon.tech）
- **Next.js DevTools**：浏览器开发者工具查看 React 组件树

## 8. 下一步测试方向

完成基础测试后，可以：
1. 创建更多测试文章验证分页和列表效果
2. 测试多语言内容切换
3. 添加不同分类和标签验证筛选功能
4. 测试 SEO 和 OG 卡片（分享预览）