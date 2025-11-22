# 部署指南 (Deployment Guide)

本文档提供详细的部署步骤和配置说明，帮助你将模拟教学研究实验室部署到生产环境。

## 📋 目录

- [部署前准备](#部署前准备)
- [Netlify 部署（推荐）](#netlify-部署推荐)
- [Vercel 部署](#vercel-部署)
- [GitHub Pages 部署](#github-pages-部署)
- [其他平台部署](#其他平台部署)
- [自定义域名配置](#自定义域名配置)
- [部署后验证](#部署后验证)
- [故障排查](#故障排查)

## 部署前准备

### 1. 环境检查

确保你的开发环境满足以下要求：

```bash
# 检查 Node.js 版本（需要 18+）
node --version

# 检查 npm 版本
npm --version
```

### 2. 本地构建测试

在部署前，务必在本地测试构建过程：

```bash
# 安装依赖
npm install

# 运行构建
npm run build

# 检查构建输出
ls -la out/

# 本地预览
npx serve out
# 或
cd out && python -m http.server 8000
```

访问 `http://localhost:8000` 验证所有功能正常。

### 3. 代码提交

确保所有代码已提交到 Git 仓库：

```bash
git status
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Netlify 部署（推荐）

Netlify 是最简单的部署方式，支持自动构建和持续部署。

### 方法 1: 通过 Git 仓库部署（推荐）

#### 步骤 1: 准备 Git 仓库

1. 在 GitHub/GitLab/Bitbucket 创建仓库
2. 推送代码到仓库

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

#### 步骤 2: 连接 Netlify

1. 访问 [Netlify](https://app.netlify.com/)
2. 注册/登录账号
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
5. 授权 Netlify 访问你的仓库
6. 选择项目仓库

#### 步骤 3: 配置构建设置

Netlify 会自动从 `netlify.toml` 读取配置，但你也可以手动确认：

- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `out`
- **Node version**: 18

#### 步骤 4: 部署

1. 点击 **"Deploy site"**
2. 等待构建完成（通常 2-3 分钟）
3. 构建成功后，Netlify 会生成一个随机 URL（如 `https://random-name-123.netlify.app`）
4. 访问 URL 验证部署成功

#### 步骤 5: 持续部署

配置完成后，每次推送到 `main` 分支都会自动触发部署：

```bash
git add .
git commit -m "Update feature"
git push origin main
# Netlify 会自动检测并重新部署
```

### 方法 2: 拖拽部署（快速测试）

适合快速测试或一次性部署：

1. 本地构建项目
   ```bash
   npm run build
   ```

2. 访问 [Netlify Drop](https://app.netlify.com/drop)

3. 将 `out` 文件夹拖拽到页面

4. 等待上传完成，获取部署 URL

**注意**: 拖拽部署不支持自动更新，每次更新需要重新拖拽。

### 方法 3: Netlify CLI 部署

使用命令行工具部署：

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化项目
netlify init

# 部署
netlify deploy --prod
```

## Vercel 部署

Vercel 是 Next.js 的官方推荐平台，部署过程类似 Netlify。

### 通过 Git 仓库部署

1. 访问 [Vercel](https://vercel.com/)
2. 注册/登录账号
3. 点击 **"Add New Project"**
4. 导入 Git 仓库
5. Vercel 会自动检测 Next.js 项目
6. 确认配置：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
7. 点击 **"Deploy"**

### 通过 CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## GitHub Pages 部署

GitHub Pages 可以免费托管静态网站，但需要额外配置。

### 步骤 1: 修改配置

如果你的仓库不是根路径，需要添加 `basePath`：

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',
  basePath: '/your-repo-name', // 添加这一行
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

### 步骤 2: 构建和部署

```bash
# 构建项目
npm run build

# 创建 .nojekyll 文件（禁用 Jekyll）
touch out/.nojekyll

# 部署到 gh-pages 分支
git add out -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix out origin gh-pages
```

### 步骤 3: 配置 GitHub Pages

1. 访问仓库的 **Settings** → **Pages**
2. 选择 **Source**: `gh-pages` 分支
3. 点击 **Save**
4. 等待几分钟，访问 `https://your-username.github.io/your-repo-name`

### 自动化部署（GitHub Actions）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## 其他平台部署

### AWS S3 + CloudFront

```bash
# 安装 AWS CLI
pip install awscli

# 配置 AWS 凭证
aws configure

# 构建项目
npm run build

# 上传到 S3
aws s3 sync out/ s3://your-bucket-name --delete

# 清除 CloudFront 缓存
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Azure Static Web Apps

1. 访问 [Azure Portal](https://portal.azure.com/)
2. 创建 Static Web App 资源
3. 连接 Git 仓库
4. 配置构建设置：
   - **App location**: `/code`
   - **Output location**: `out`

### Cloudflare Pages

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 连接 Git 仓库
3. 配置构建：
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
4. 部署

### Firebase Hosting

```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录
firebase login

# 初始化项目
firebase init hosting

# 配置 firebase.json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}

# 构建
npm run build

# 部署
firebase deploy --only hosting
```

## 自定义域名配置

### Netlify 自定义域名

1. 在 Netlify 项目设置中，点击 **"Domain settings"**
2. 点击 **"Add custom domain"**
3. 输入你的域名（如 `example.com`）
4. 在域名提供商处添加 DNS 记录：

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

5. 等待 DNS 传播（可能需要几小时）
6. Netlify 会自动配置 HTTPS 证书

### Vercel 自定义域名

1. 在 Vercel 项目设置中，点击 **"Domains"**
2. 输入你的域名
3. 添加 DNS 记录：

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 部署后验证

### 功能检查清单

部署完成后，请验证以下功能：

- [ ] 首页正常加载
- [ ] 导航栏链接正常工作
- [ ] 案例馆页面显示正确
- [ ] 案例详情页可以访问
- [ ] 工坊页面四个步骤都能访问
- [ ] API 配置对话框可以打开
- [ ] localStorage 数据持久化正常
- [ ] 页面刷新后数据不丢失
- [ ] 所有静态资源（图片、字体）加载正常
- [ ] 移动端响应式布局正常

### 性能检查

使用以下工具检查网站性能：

1. **Lighthouse**（Chrome DevTools）
   - 打开 Chrome DevTools
   - 切换到 Lighthouse 标签
   - 运行审计
   - 目标分数：Performance > 90

2. **PageSpeed Insights**
   - 访问 [PageSpeed Insights](https://pagespeed.web.dev/)
   - 输入你的网站 URL
   - 查看移动端和桌面端分数

3. **WebPageTest**
   - 访问 [WebPageTest](https://www.webpagetest.org/)
   - 测试首次加载时间
   - 目标：First Contentful Paint < 1.5s

### API 功能测试

1. 配置 API 密钥
2. 测试选题生成功能
3. 测试文献综述生成
4. 测试学生对话模拟
5. 测试 PDF 导出功能

## 故障排查

### 问题 1: 构建失败

**症状**: `npm run build` 报错

**可能原因**:
- Node.js 版本过低
- 依赖安装不完整
- TypeScript 类型错误

**解决方法**:
```bash
# 检查 Node.js 版本
node --version  # 应该 >= 18

# 清除缓存并重新安装
rm -rf node_modules package-lock.json .next out
npm install

# 重新构建
npm run build
```

### 问题 2: 部署后页面空白

**症状**: 访问部署的 URL 显示空白页面

**可能原因**:
- 静态资源路径错误
- JavaScript 加载失败
- 浏览器控制台有错误

**解决方法**:
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签的错误信息
3. 检查 Network 标签，确认所有资源都成功加载
4. 如果使用子路径部署，确认 `basePath` 配置正确

### 问题 3: API 调用失败

**症状**: 配置 API 后无法生成内容

**可能原因**:
- CORS 限制
- API Key 无效
- API 端点错误

**解决方法**:
1. 检查浏览器控制台的网络请求
2. 确认 API Key 有效且有足够额度
3. 测试 API 端点是否支持 CORS
4. 尝试使用支持 CORS 的 API 提供商（如 DeepSeek）

### 问题 4: localStorage 数据丢失

**症状**: 刷新页面后数据消失

**可能原因**:
- 浏览器隐私模式
- localStorage 被禁用
- 域名变更

**解决方法**:
1. 确认不在隐私/无痕模式
2. 检查浏览器设置，确保允许 localStorage
3. 使用相同的域名访问（不要混用 www 和非 www）

### 问题 5: 字体显示异常

**症状**: 学生对话的楷体字体未生效

**可能原因**:
- 系统缺少楷体字体
- 字体加载失败

**解决方法**:
1. 检查 `app/globals.css` 中的字体配置
2. 确认字体 fallback 链正确：
   ```css
   font-family: 'KaiTi', 'STKaiti', 'SimKai', serif;
   ```
3. 在 Windows/Mac/Linux 上测试

### 问题 6: 移动端布局错乱

**症状**: 在手机上显示不正常

**可能原因**:
- 响应式断点配置错误
- CSS 未正确加载

**解决方法**:
1. 使用 Chrome DevTools 的设备模拟器测试
2. 检查 Tailwind CSS 响应式类是否正确
3. 确认 viewport meta 标签存在：
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

## 监控和维护

### 设置监控

1. **Uptime 监控**
   - [UptimeRobot](https://uptimerobot.com/)（免费）
   - [Pingdom](https://www.pingdom.com/)

2. **错误追踪**
   - [Sentry](https://sentry.io/)
   - 在 `app/layout.tsx` 中集成

3. **分析工具**
   - Google Analytics
   - Plausible Analytics（隐私友好）

### 定期维护

- **每月**: 检查依赖更新 `npm outdated`
- **每季度**: 更新 Next.js 和主要依赖
- **每半年**: 审查和优化性能

### 备份策略

虽然是纯前端应用，但建议：
- 定期备份 Git 仓库
- 导出重要的研究会话（PDF）
- 保存 API 配置信息

## 安全建议

1. **API Key 保护**
   - 提醒用户不要在公共场合分享 API Key
   - 定期轮换 API Key

2. **HTTPS**
   - 确保部署平台启用 HTTPS
   - Netlify 和 Vercel 默认提供免费 SSL

3. **内容安全策略**
   - 在 `next.config.ts` 中配置 CSP headers

4. **依赖安全**
   ```bash
   # 检查安全漏洞
   npm audit
   
   # 自动修复
   npm audit fix
   ```

## 成本估算

### 免费方案

- **Netlify**: 100GB 带宽/月，300 分钟构建时间/月
- **Vercel**: 100GB 带宽/月，6000 分钟构建时间/月
- **GitHub Pages**: 100GB 带宽/月，无构建时间限制

### 付费方案（如需更多资源）

- **Netlify Pro**: $19/月，400GB 带宽
- **Vercel Pro**: $20/月，1TB 带宽
- **Cloudflare Pages**: 免费无限带宽

### API 成本

- **DeepSeek**: ~¥0.001/1K tokens（非常便宜）
- **OpenAI GPT-4**: ~$0.03/1K tokens

## 总结

推荐部署方案：

1. **个人使用**: Netlify 拖拽部署（最简单）
2. **团队协作**: Netlify/Vercel Git 集成（自动部署）
3. **企业部署**: AWS S3 + CloudFront（可控性强）

选择适合你的方案，按照本指南操作即可成功部署！

---

**需要帮助？** 请在 GitHub 提交 Issue 或查看项目文档。
