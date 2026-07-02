# GitHub 推送和 Vercel 部署指南

本指南将帮助您将博客项目推送到 GitHub 并部署到 Vercel。

---

## 📋 部署前检查清单

### 1️⃣ 检查环境变量文件

确保 `.env.local` 文件包含以下必需的环境变量：

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Optional: If using Vercel Blob for image upload
BLOB_READ_WRITE_TOKEN="..."
```

⚠️ **重要提示**：
- `.env.local` 文件不会被推送到 GitHub（已在 `.gitignore` 中）
- 需要在 Vercel Dashboard 中手动配置这些环境变量

### 2️⃣ 检查项目构建状态

运行构建命令确保项目无错误：

```bash
npm run build
```

**预期结果**：
- ✓ Compiled successfully
- ✓ Linting and checking validity of types
- ✓ 12 static pages generated

### 3️⃣ 检查依赖版本

确保所有依赖已正确安装：

```bash
npm install
```

---

## 🚀 步骤 1: 推送到 GitHub

### 方法 A: 通过 GitHub Desktop（推荐）

1. **下载 GitHub Desktop**：https://desktop.github.com/

2. **创建新仓库**：
   - 打开 GitHub Desktop
   - 点击 "File" → "New Repository"
   - Repository name: `my_blog`
   - Description: `Modern Next.js Full-Stack Blog`
   - Local path: `/Users/troyyang/Documents/trae_projects/my_blog`
   - 勾选 "Initialize this repository with a README"
   - Git ignore: 选择 "Node"
   - License: 选择 "MIT"（可选）

3. **推送到 GitHub**：
   - 点击 "Publish repository"
   - Repository name: `my_blog`
   - 保持 "Keep this code private" 未勾选（公开仓库）
   - 点击 "Publish repository"

4. **后续更新**：
   - 修改代码后，点击 "Push origin" 推送更新

### 方法 B: 通过 Git 命令行

如果您熟悉 Git 命令行，可以按以下步骤操作：

```bash
# 1. 初始化 Git 仓库（如果尚未初始化）
git init

# 2. 添加所有文件到暂存区
git add .

# 3. 创建首次提交
git commit -m "Initial commit: Next.js full-stack blog"

# 4. 在 GitHub 创建仓库
# 访问 https://github.com/new
# Repository name: my_blog
# 选择 Public
# 不要勾选 "Initialize this repository with a README"
# 点击 "Create repository"

# 5. 添加远程仓库地址（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/my_blog.git

# 6. 推送到 GitHub
git push -u origin main
```

---

## 🌐 步骤 2: 部署到 Vercel

### 1️⃣ 创建 Vercel 账号

访问 https://vercel.com/signup

**推荐使用 GitHub 登录**：
- 点击 "Continue with GitHub"
- 授权 Vercel 访问您的 GitHub 仓库

### 2️⃣ 导入项目

1. **进入 Vercel Dashboard**：https://vercel.com/dashboard

2. **点击 "Add New..." → "Project"**

3. **选择 GitHub 仓库**：
   - 在 "Import Git Repository" 页面
   - 找到 `my_blog` 仓库
   - 点击 "Import"

### 3️⃣ 配置项目

在 "Configure Project" 页面：

**Framework Preset**：
- 自动识别为 `Next.js`

**Root Directory**：
- 保持默认 `./`

**Build Command**：
- 保持默认 `next build`

**Output Directory**：
- 保持默认 `.next`

**Install Command**：
- 保持默认 `npm install`

### 4️⃣ 配置环境变量

点击 "Environment Variables" 展开，添加以下变量：

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

⚠️ **注意**：
- `NEXT_PUBLIC_*` 变量会暴露到客户端，务必使用测试环境的密钥
- 生产环境部署时，需要替换为 Clerk 生产密钥

### 5️⃣ 部署项目

点击 "Deploy" 按钮：

- Vercel 会自动构建和部署项目
- 等待约 2-5 分钟
- 部署成功后会显示 "Congratulations!" 页面

### 6️⃣ 访问部署的应用

部署完成后，您会获得：

- **Preview URL**：`https://my-blog-xxx.vercel.app`
- **Production URL**：`https://my-blog.vercel.app`（如果配置了自定义域名）

点击 "Visit" 按钮访问应用。

---

## ⚙️ 步骤 3: 配置 Clerk 生产环境

### 1️⃣ 创建 Clerk 生产实例

访问 Clerk Dashboard：https://dashboard.clerk.com/

**操作步骤**：
1. 选择您的应用
2. 点击 "Instance Settings"
3. 点击 "Create Production Instance"
4. 复制生产环境的 API Keys：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`（以 `pk_live_` 开头）
   - `CLERK_SECRET_KEY`（以 `sk_live_` 开头）

### 2️⃣ 更新 Vercel 环境变量

在 Vercel Dashboard：

1. 进入项目 Settings → Environment Variables
2. 更新 Clerk 变量为生产密钥：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...`
   - `CLERK_SECRET_KEY=sk_live_...`
3. 点击 "Save"
4. 点击 "Redeploy" 重新部署项目

---

## 🔧 步骤 4: 配置自定义域名（可选）

### 1️⃣ 添加域名

在 Vercel Dashboard：

1. 进入项目 Settings → Domains
2. 输入您的域名（如 `blog.yourdomain.com`）
3. 点击 "Add"

### 2️⃣ 配置 DNS

根据 Vercel 提示，在您的域名服务商配置 DNS：

**A 记录**（如果使用子域名）：
```
blog.yourdomain.com → A → 76.76.21.21
```

**CNAME 记录**（如果使用子域名）：
```
blog.yourdomain.com → CNAME → cname.vercel-dns.com
```

### 3️⃣ 等待 DNS 生效

- DNS 配置生效需要 5-30 分钟
- Vercel 会自动配置 SSL 证书
- 完成后访问 `https://blog.yourdomain.com`

---

## 📊 步骤 5: 配置 Vercel Analytics（可选）

### 1️⃣ 启用 Analytics

在 Vercel Dashboard：

1. 进入项目 Settings → Analytics
2. 点击 "Enable Analytics"
3. 选择免费计划（每月 100k events）

### 2️⃣ 集成到项目

安装 Vercel Analytics SDK：

```bash
npm install @vercel/analytics
```

修改 `src/app/layout.tsx`：

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔄 步骤 6: 配置自动部署

### Continuous Deployment（CD）

Vercel 自动配置了 CD：

- **每次推送到 main 分支**：自动触发生产环境部署
- **每次推送 Pull Request**：自动创建 Preview 部署
- **Preview 部署 URL**：`https://my-blog-git-branch-xxx.vercel.app`

### 分支保护规则（可选）

在 GitHub 仓库设置：

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. 勾选：
   - "Require pull request reviews before merging"
   - "Require status checks to pass before merging"
4. 点击 "Create"

---

## 🛠️ 常见问题与解决方案

### 1️⃣ 构建失败

**问题**：`npm run build` 在 Vercel 失败

**解决方案**：
- 检查 TypeScript 类型错误（运行 `npm run build` 本地验证）
- 检查 ESLint 错误（运行 `npm run lint`）
- 检查环境变量是否配置正确

### 2️⃣ Clerk 认证失败

**问题**：登录时提示 "Clerk has been loaded with development keys"

**解决方案**：
- 确保使用 Clerk 生产密钥（`pk_live_*` 和 `sk_live_*`）
- 在 Clerk Dashboard 配置允许的域名（Production Instance → Settings → Allowed URLs）

### 3️⃣ 数据库连接失败

**问题**：应用无法连接到 Neon 数据库

**解决方案**：
- 检查 `DATABASE_URL` 环境变量是否正确
- 在 Neon Dashboard 检查数据库状态
- 确保连接字符串包含 `sslmode=require`

### 4️⃣ 图片上传失败

**问题**：如果使用 Vercel Blob，图片上传失败

**解决方案**：
- 确保配置了 `BLOB_READ_WRITE_TOKEN`
- 从 Vercel Dashboard → Storage → Blob 获取 token
- 在项目环境变量中添加 token

---

## 🎉 部署成功检查清单

部署完成后，请验证以下功能：

- ✅ 前台首页可访问（`https://your-domain.vercel.app/zh`）
- ✅ 多语言切换正常（点击 EN/中文按钮）
- ✅ 文章详情页可访问
- ✅ Clerk 登录/注册功能正常
- ✅ Dashboard 管理后台可访问（登录后）
- ✅ 文章创建/编辑/删除功能正常
- ✅ 分类和标签管理功能正常
- ✅ 响应式布局正常（移动端/桌面端）
- ✅ Dark Mode 主题切换正常
- ✅ 数据库连接正常（文章数据可保存）

---

## 📚 相关文档

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Clerk Production Deployment](https://clerk.com/docs/deployments/overview)
- [Neon PostgreSQL Connection](https://neon.tech/docs/connect/connect-from-any-app)

---

## 🚀 下一步

部署成功后，您可以考虑：

1. **配置图片上传功能**（Vercel Blob）
2. **启用 Vercel Analytics**（访问统计）
3. **配置自定义域名**
4. **设置 GitHub Actions**（CI/CD 增强）
5. **添加更多前台页面**（归档、关于等）

祝您部署顺利！🎊