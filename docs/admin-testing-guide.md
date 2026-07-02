# 后台管理模块测试指南

## 前置条件

### 1. 推送数据库 Schema（如果尚未完成）

```bash
npm run db:push
```

这将创建所有必要的数据库表。

### 2. 确认开发服务器运行

开发服务器已在端口 **3002** 运行（端口 3000 和 3001 被占用）。

访问地址：http://localhost:3002

---

## 测试步骤

### 步骤 1：测试认证保护

后台管理页面受 Clerk 认证保护，未登录用户会自动跳转到登录页。

1. **未登录访问测试**：
   - 直接访问：http://localhost:3002/dashboard/posts
   - **预期结果**：自动跳转到登录页面

2. **登录流程测试**：
   - 访问：http://localhost:3002/sign-in
   - 使用 Clerk 测试账号登录（或创建新账号）
   - 登录成功后，应该能看到 Clerk UserButton

### 步骤 2：测试文章列表页

登录后访问：http://localhost:3002/dashboard/posts

**预期功能**：
- ✅ 显示页面标题"文章管理"
- ✅ 显示"新建文章"按钮
- ✅ 如果数据库为空，显示"暂无文章"提示
- ✅ 如果有文章，显示文章表格（标题、分类、状态、创建时间、操作按钮）

### 步骤 3：测试文章创建功能

访问：http://localhost:3002/dashboard/posts/new

**测试点**：
1. **Slug 输入**：
   - 输入 Slug（如：`test-article-001`）
   - 必填项验证

2. **中文内容编辑**：
   - 输入标题
   - 输入摘要（可选）
   - 使用 TipTap 编辑器编写内容

3. **TipTap 编辑器测试**：
   - 点击工具栏按钮测试：
     - **加粗**（Bold）
     - **斜体**（Italic）
     - **标题**（H1、H2、H3）
     - **列表**（有序、无序）
     - **引用**（Blockquote）
     - **代码**（Code）
     - **撤销/重做**（Undo/Redo）
   - 输入内容时应该看到实时更新
   - 测试占位提示文本

4. **英文内容编辑**：
   - 输入英文标题
   - 输入英文摘要
   - 使用英文 TipTap 编辑器编写内容

5. **保存功能**：
   - 点击"保存为草稿"按钮
   - **预期结果**：跳转到文章列表页，新文章出现在列表中，状态显示"草稿"

### 步骤 4：测试文章编辑功能

从文章列表页点击某个文章的"编辑"按钮（铅笔图标）

**测试点**：
1. **数据加载**：
   - 页面应该自动加载现有文章数据
   - Slug、标题、摘要、内容都应正确显示
   - 显示当前状态（已发布/草稿）

2. **修改内容**：
   - 修改 Slug
   - 修改标题
   - 修改摘要
   - 使用 TipTap 编辑器修改内容

3. **保存修改**：
   - 点击"保存修改"按钮
   - **预期结果**：跳转到文章列表页，修改后的内容生效

### 步骤 5：测试状态切换（需要完善）

⚠️ **注意**：当前状态切换功能需要在文章列表页点击眼睛图标，但功能尚未完全实现（需要补充获取当前状态的逻辑）。

临时测试方法：
- 在 [admin-post.ts](file:///Users/troyyang/Documents/trae_projects/my_blog/src/actions/admin-post.ts) 中手动调用 `togglePostPublishStatus(postId, true)` 发布文章
- 或使用 Drizzle Studio 手动修改 `posts` 表的 `published` 字段

### 步骤 6：测试删除功能（需要完善）

⚠️ **注意**：删除功能已实现 Server Action，但文章列表页的删除按钮需要补充正确的 form action 处理。

临时测试方法：
- 使用 Drizzle Studio 或 SQL 直接删除测试文章

### 步骤 7：测试前台展示效果

创建文章后，访问前台页面验证显示效果：

1. **中文首页**：http://localhost:3002/zh
   - 如果文章已发布（`published=true`），应该看到文章卡片
   - 点击文章卡片，跳转到详情页

2. **英文首页**：http://localhost:3002/en
   - 测试多语言切换效果

3. **文章详情页**：http://localhost:3002/zh/post/你的文章slug
   - 验证 TipTap 编辑的内容是否正确渲染
   - 验证 Prose 样式排版效果
   - 验证分类、标签、日期显示

---

## 使用 Drizzle Studio 创建测试数据（推荐）

如果想要快速创建测试数据，推荐使用 Drizzle Studio：

```bash
npm run db:studio
```

浏览器打开：https://local.drizzle.studio/

### 创建测试数据的顺序：

1. **创建分类**：
   - 在 `categories` 表插入记录：`slug: "technology"`
   - 在 `category_translations` 表插入翻译：
     - `category_id: 1, locale: "zh", name: "技术"`
     - `category_id: 1, locale: "en", name: "Technology"`

2. **创建标签**：
   - 在 `tags` 表插入记录：`slug: "nextjs"`
   - 在 `tag_translations` 表插入翻译：
     - `tag_id: 1, locale: "zh", name: "Next.js"`
     - `tag_id: 1, locale: "en", name: "Next.js"`

3. **创建文章**：
   - 在 `posts` 表插入记录：
     - `slug: "test-article-001"`
     - `published: true`（设置为已发布）
     - `published_at: 当前时间`
     - `category_id: 1`
   - 在 `post_translations` 表插入翻译：
     - `post_id: 1, locale: "zh", title: "测试文章", content: "<p>这是测试内容</p><h2>标题</h2><p>更多内容...</p>", excerpt: "测试摘要"`
     - `post_id: 1, locale: "en", title: "Test Article", content: "<p>This is test content</p><h2>Heading</h2><p>More content...</p>", excerpt: "Test excerpt"`

4. **关联标签**：
   - 在 `posts_to_tags` 表插入记录：`post_id: 1, tag_id: 1`

---

## 测试检查清单

### ✅ 认证测试
- [ ] 未登录时访问后台自动跳转到登录页
- [ ] 登录成功后能访问后台页面
- [ ] UserButton 显示正确
- [ ] 登出后无法访问后台页面

### ✅ 文章列表页测试
- [ ] 页面正确渲染
- [ ] 空状态提示显示正确
- [ ] 文章表格正确显示（如有数据）
- [ ] "新建文章"按钮可点击

### ✅ 文章创建页测试
- [ ] Slug 输入验证
- [ ] TipTap 编辑器工具栏功能正常
- [ ] 中英文内容编辑功能正常
- [ ] 保存功能正常，跳转到列表页
- [ ] 新文章出现在列表中，状态为"草稿"

### ✅ 文章编辑页测试
- [ ] 现有文章数据正确加载
- [ ] 修改功能正常
- [ ] 保存修改后内容更新正确

### ✅ TipTap 编辑器测试
- [ ] 加粗、斜体、删除线、代码功能正常
- [ ] 标题（H1/H2/H3）切换正常
- [ ] 有序/无序列表功能正常
- [ ] 引用块功能正常
- [ ] 撤销/重做功能正常
- [ ] 占位提示显示正确

### ✅ 前台展示测试
- [ ] 已发布文章在首页显示
- [ ] 文章详情页内容正确渲染
- [ ] Prose 样式正确应用
- [ ] 多语言切换正常

---

## 常见问题排查

### 问题 1：文章创建后前台不显示
**原因**：文章状态为草稿（`published=false`）
**解决**：在数据库手动设置 `published=true`，或实现状态切换功能

### 问题 2：TipTap 编辑器内容不保存
**原因**：`onChange` 回调未正确触发
**排查**：检查 [TipTapEditor.tsx](file:///Users/troyyang/Documents/trae_projects/my_blog/src/components/admin/TipTapEditor.tsx) 的 `onUpdate` 配置

### 问题 3：登录后看不到 UserButton
**原因**：Clerk 配置问题
**排查**：检查 `.env.local` 中的 Clerk 配置，确保 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 正确

### 问题 4：文章列表显示"未知"日期
**原因**：`createdAt` 为 null
**解决**：确保数据库插入时正确设置时间戳

---

## 下一步改进方向

当前后台管理模块的核心功能已实现，以下功能可根据需要继续完善：

1. **状态切换按钮**：实现完整的发布/取消发布功能（需获取当前状态）
2. **删除确认对话框**：添加 Dialog 组件防止误删
3. **分类和标签管理页面**：创建 UI 页面管理分类和标签
4. **封面图上传**：实现图片上传功能
5. **表单验证增强**：添加更严格的输入验证
6. **错误提示优化**：使用 Toast 组件替代 alert()

---

**开发服务器正在运行**，请访问 http://localhost:3002 开始测试！