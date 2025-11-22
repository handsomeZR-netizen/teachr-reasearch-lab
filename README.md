# 模拟教学研究实验室

一个面向全学科一线教师的纯前端科研辅助工具。教师无需代码知识，即可通过 AI 模拟不同认知水平的学生，完成"选题→文献→模拟教学→成果分析"的完整科研闭环。

## ✨ 核心特性

- 🎯 **智能选题向导**: AI 辅助生成研究题目
- 📚 **文献综述生成**: 自动生成 500-800 字文献综述草稿
- 👥 **学生画像模拟**: 三种认知水平学生（A/B/C）真实对话模拟
- 💬 **实时对话交互**: 流式响应，模拟真实课堂场景
- 📊 **可视化分析**: 雷达图展示认知负荷、参与度、理解度
- 📄 **PDF 报告导出**: 一键生成完整研究报告
- 💾 **本地数据存储**: 所有数据保存在浏览器，隐私安全
- 🚀 **零配置部署**: 纯静态网站，可部署到任何静态托管平台

## 🛠️ 技术栈

- **Framework**: Next.js 16+ with App Router and Static Export
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with localStorage persistence
- **Charts**: Recharts for radar chart visualization
- **PDF Generation**: jsPDF + html2canvas
- **Compression**: LZ-string for localStorage optimization
- **Icons**: Lucide React

## 📦 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 本地开发

```bash
# 1. 克隆项目
git clone <repository-url>
cd code

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开
# http://localhost:3000
```

### 构建和预览

```bash
# 构建静态导出
npm run build

# 预览构建结果
npx serve out

# 或使用 Python 简单服务器
cd out
python -m http.server 8000
```

## 🚀 部署指南

### 部署到 Netlify（推荐）

#### 方法 1: 通过 Git 仓库部署

1. **推送代码到 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **在 Netlify 中导入项目**
   - 访问 [Netlify](https://app.netlify.com/)
   - 点击 "Add new site" → "Import an existing project"
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 选择项目仓库

3. **配置构建设置**（自动从 `netlify.toml` 读取）
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18

4. **部署**
   - 点击 "Deploy site"
   - 等待构建完成（通常 2-3 分钟）
   - 访问生成的 URL

#### 方法 2: 拖拽部署

1. **本地构建**
   ```bash
   npm run build
   ```

2. **拖拽部署**
   - 访问 [Netlify Drop](https://app.netlify.com/drop)
   - 将 `out` 文件夹拖拽到页面
   - 等待上传完成

### 部署到其他平台

#### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### GitHub Pages

1. 修改 `next.config.ts`，添加 `basePath`:
   ```typescript
   const nextConfig = {
     output: 'export',
     basePath: '/your-repo-name',
     // ...
   }
   ```

2. 构建并推送到 `gh-pages` 分支:
   ```bash
   npm run build
   git add out -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix out origin gh-pages
   ```

#### 任何静态托管服务

只需将 `out` 目录上传到任何支持静态网站的服务：
- AWS S3 + CloudFront
- Azure Static Web Apps
- Cloudflare Pages
- Firebase Hosting

## 🔑 用户配置指南

### 首次使用配置

1. **访问部署的网站**

2. **配置 API 密钥**（可选但推荐）
   - 点击右上角的设置图标 ⚙️
   - 在弹出的对话框中配置：
     - **Provider**: 选择 AI 服务提供商（DeepSeek/OpenAI/Custom）
     - **Base URL**: API 端点地址
     - **API Key**: 你的 API 密钥
     - **Model**: 模型名称（如 `deepseek-chat`）

3. **保存配置**
   - 点击"保存配置"按钮
   - 配置将保存在浏览器本地存储中

### API 配置示例

#### DeepSeek（推荐）

```
Provider: deepseek
Base URL: https://api.deepseek.com/v1
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxx
Model: deepseek-chat
```

获取 API Key: [DeepSeek Platform](https://platform.deepseek.com/)

#### OpenAI

```
Provider: openai
Base URL: https://api.openai.com/v1
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxx
Model: gpt-4
```

获取 API Key: [OpenAI Platform](https://platform.openai.com/)

#### 自定义 API

```
Provider: custom
Base URL: https://your-api-endpoint.com/v1
API Key: your-api-key
Model: your-model-name
```

### 数据存储说明

- ✅ **所有数据存储在浏览器本地** (localStorage)
- ✅ **API 密钥仅保存在你的浏览器中**
- ✅ **不会上传到任何服务器**
- ⚠️ **清除浏览器数据会丢失所有研究会话**
- 💡 **建议定期导出 PDF 报告备份**

### 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📖 使用流程

### 1. 浏览案例馆
- 访问"案例馆"页面
- 按学科筛选（数学、物理、语文、英语）
- 点击案例查看详情
- 可以 Fork 案例到工坊

### 2. 研究工坊 - 四步流程

#### 步骤 1: 选题向导
- 输入年级、学科、教学困惑
- AI 生成 3 个推荐题目
- 选择一个题目进入下一步

#### 步骤 2: 文献综述
- 查看选定的题目
- 点击"生成文献综述"
- AI 生成 500-800 字综述草稿
- 可编辑修改内容

#### 步骤 3: 模拟课堂
- 输入或粘贴教案
- 选择学生画像（A/B/C）
- 与 AI 扮演的学生对话
- 测试教学设计效果
- 点击"效果不佳？"获取改进建议

#### 步骤 4: 成果导出
- 查看雷达图分析
- 阅读 AI 生成的分析报告
- 点击"下载 PDF 报告"
- 获取完整研究报告

### 3. 会话管理
- 自动保存研究进度
- 可随时恢复之前的会话
- 支持删除旧会话释放空间

## 📁 项目结构

```
code/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx               # 根布局（全局提供商）
│   ├── page.tsx                 # 首页（Hero + 三步流程）
│   ├── globals.css              # 全局样式（自定义主题）
│   ├── cases/
│   │   ├── page.tsx            # 案例馆（学科筛选）
│   │   └── [id]/
│   │       └── page.tsx        # 案例详情（Fork 功能）
│   └── workshop/
│       └── page.tsx            # 研究工坊（四步向导）
├── components/                   # React 组件
│   ├── navbar.tsx               # 导航栏（API 设置入口）
│   ├── api-config-dialog.tsx   # API 配置对话框
│   ├── case-card.tsx            # 案例卡片
│   ├── workshop-sidebar.tsx    # 工坊侧边栏
│   ├── chat-interface.tsx      # 聊天界面
│   ├── student-profile-selector.tsx  # 学生画像选择器
│   ├── radar-chart.tsx         # 雷达图
│   ├── session-list.tsx        # 会话列表
│   ├── session-manager-dialog.tsx  # 会话管理
│   ├── error-alert.tsx         # 错误提示
│   ├── storage-cleanup-dialog.tsx  # 存储清理
│   ├── step-panels/            # 工坊步骤面板
│   │   ├── step1-topic.tsx
│   │   ├── step2-literature.tsx
│   │   ├── step3-simulation.tsx
│   │   └── step4-export.tsx
│   └── ui/                     # shadcn/ui 基础组件
├── lib/                         # 工具函数和服务
│   ├── types.ts                # TypeScript 类型定义
│   ├── api-service.ts          # AI API 服务层
│   ├── prompts.ts              # Prompt 模板
│   ├── pdf-export.ts           # PDF 导出功能
│   ├── mock-cases.ts           # 案例数据
│   ├── compressed-storage.ts   # 压缩存储工具
│   ├── storage-utils.ts        # 存储工具函数
│   ├── api-cache.ts            # API 缓存
│   ├── stores/                 # Zustand 状态管理
│   │   ├── use-config-store.ts    # API 配置存储
│   │   └── use-research-store.ts  # 研究会话存储
│   └── hooks/                  # 自定义 React Hooks
│       ├── use-error-handler.ts
│       ├── use-loading.ts
│       ├── use-storage-monitor.ts
│       └── use-abort-controller.ts
├── public/                      # 静态资源
│   ├── _redirects              # Netlify 重定向规则
│   └── *.svg                   # 图标文件
├── next.config.ts              # Next.js 配置（静态导出）
├── netlify.toml                # Netlify 部署配置
├── tailwind.config.ts          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
├── biome.json                  # Biome 代码格式化配置
└── package.json                # 项目依赖
```

## 🎨 主题配置

项目使用自定义主题颜色，营造学术氛围：

- **主色**: `#006666` (Teal) - 按钮和激活状态
- **背景色**: `#F9F9F7` (Off-white) - 页面背景
- **学生对话字体**: KaiTi (楷体) - 增强课堂真实感

所有颜色变量定义在 `app/globals.css` 中，可根据需要自定义。

## ⚙️ 配置文件说明

### next.config.ts

```typescript
const nextConfig = {
  output: 'export',           // 启用静态导出
  images: {
    unoptimized: true,        // 禁用图片优化（静态导出要求）
  },
  trailingSlash: true,        // URL 末尾添加斜杠（兼容性更好）
};
```

### netlify.toml

```toml
[build]
  command = "npm run build"   # 构建命令
  publish = "out"             # 发布目录

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200                # SPA 路由支持

[build.environment]
  NODE_VERSION = "18"         # Node.js 版本
```

### 环境变量

**本项目不需要任何环境变量！** 

所有配置由用户在浏览器中设置，包括：
- API 密钥
- API 端点
- 模型选择

这确保了：
- ✅ 零配置部署
- ✅ 用户隐私保护
- ✅ 多用户独立配置

## 🔧 开发指南

### 代码规范

```bash
# 检查代码规范
npm run lint

# 自动格式化代码
npm run format
```

### 添加新组件

```bash
# 使用 shadcn/ui CLI 添加组件
npx shadcn@latest add <component-name>
```

### 调试技巧

1. **查看 localStorage 数据**
   ```javascript
   // 在浏览器控制台
   console.log(localStorage.getItem('simulation-lab-api-config'));
   console.log(localStorage.getItem('simulation-lab-sessions'));
   ```

2. **清除所有数据**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

3. **查看 API 调用**
   - 打开浏览器开发者工具
   - 切换到 Network 标签
   - 筛选 Fetch/XHR 请求

## 🐛 常见问题

### Q: 构建失败怎么办？

A: 检查以下几点：
- Node.js 版本是否 >= 18
- 依赖是否完整安装 (`npm install`)
- 删除 `.next` 和 `out` 目录后重新构建

### Q: API 调用失败？

A: 可能的原因：
- API Key 无效或过期
- API 端点 URL 错误
- 网络连接问题
- CORS 限制（某些 API 不支持浏览器直接调用）

解决方法：
- 检查 API 配置是否正确
- 查看浏览器控制台错误信息
- 尝试使用支持 CORS 的 API 提供商

### Q: localStorage 存储空间不足？

A: 浏览器 localStorage 通常限制为 5-10MB：
- 删除旧的研究会话
- 系统会自动清理 30 天以上的会话
- 定期导出 PDF 报告备份

### Q: 部署后页面空白？

A: 检查：
- 浏览器控制台是否有错误
- 静态资源路径是否正确
- 如果使用子路径部署，需要配置 `basePath`

### Q: 学生对话不够真实？

A: 可以调整：
- 在 `lib/prompts.ts` 中修改系统提示词
- 调整 temperature 参数（更高 = 更随机）
- 在 `lib/types.ts` 中修改学生画像特征

## 📚 相关文档

- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Netlify Deployment](https://docs.netlify.com/get-started/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [DeepSeek API](https://platform.deepseek.com/docs)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License - 详见 LICENSE 文件

## 🙏 致谢

感谢所有开源项目的贡献者，特别是：
- Next.js 团队
- shadcn/ui
- Radix UI
- Tailwind CSS
- Zustand

---

**如有问题或建议，欢迎提交 Issue！**
