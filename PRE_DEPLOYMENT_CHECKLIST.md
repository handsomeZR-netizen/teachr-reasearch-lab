# 部署前检查清单 (Pre-Deployment Checklist)

在部署到生产环境之前，请完成以下所有检查项。

## ✅ 代码质量检查

### 构建验证
- [ ] 运行 `npm run build` 成功
- [ ] 运行 `npm run validate` 通过
- [ ] 无 TypeScript 编译错误
- [ ] 无 ESLint/Biome 警告

```bash
npm run build
npm run validate
npm run lint
```

### 代码审查
- [ ] 所有功能已实现
- [ ] 代码已格式化
- [ ] 无调试代码（console.log, debugger）
- [ ] 无敏感信息（API keys, tokens）
- [ ] 注释清晰完整

## ✅ 功能测试

### 核心功能
- [ ] 首页正常显示
- [ ] 案例馆功能正常
- [ ] 研究工坊四步流程完整
- [ ] API 配置功能正常
- [ ] 会话管理功能正常
- [ ] PDF 导出功能正常

### 完整流程测试
- [ ] 从选题到导出 PDF 的完整流程
- [ ] 多个研究会话的创建和管理
- [ ] 跨页面刷新的数据持久化
- [ ] 错误场景的处理

## ✅ 浏览器兼容性

### 桌面浏览器
- [ ] Chrome 90+ 测试通过
- [ ] Firefox 88+ 测试通过
- [ ] Safari 14+ 测试通过
- [ ] Edge 90+ 测试通过

### 移动浏览器
- [ ] iOS Safari 测试通过
- [ ] Android Chrome 测试通过

## ✅ 响应式设计

### 设备测试
- [ ] 桌面端（1920x1080）
- [ ] 笔记本（1366x768）
- [ ] 平板（768x1024）
- [ ] 手机（375x667）

### 布局检查
- [ ] 导航栏响应式正常
- [ ] 卡片网格响应式正常
- [ ] 聊天界面响应式正常
- [ ] 表单响应式正常

## ✅ 性能优化

### Lighthouse 分数
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 95
- [ ] SEO > 90

运行 Lighthouse 审计：
```bash
# 在 Chrome DevTools 中运行 Lighthouse
# 或使用 CLI
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### 加载性能
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Total Blocking Time < 300ms

### 资源优化
- [ ] 图片已优化
- [ ] 字体已优化
- [ ] JS bundle < 500KB
- [ ] CSS bundle < 100KB

## ✅ 安全检查

### 代码安全
- [ ] 无硬编码的 API keys
- [ ] 无敏感信息泄露
- [ ] localStorage 数据加密
- [ ] CORS 配置正确

### 依赖安全
```bash
npm audit
# 如有漏洞，运行
npm audit fix
```

- [ ] 无高危漏洞
- [ ] 无中危漏洞（或已评估）
- [ ] 依赖版本最新

## ✅ 配置文件检查

### next.config.ts
- [ ] `output: 'export'` 已配置
- [ ] `images.unoptimized: true` 已配置
- [ ] `trailingSlash: true` 已配置
- [ ] 无开发环境配置

### netlify.toml
- [ ] Build command 正确
- [ ] Publish directory 正确
- [ ] Redirects 配置正确
- [ ] Node version 正确

### package.json
- [ ] 版本号已更新
- [ ] 依赖版本锁定
- [ ] Scripts 配置正确

## ✅ 文档完整性

### 用户文档
- [ ] README.md 完整
- [ ] DEPLOYMENT_GUIDE.md 完整
- [ ] API_CONFIGURATION_GUIDE.md 完整
- [ ] 所有链接有效

### 开发文档
- [ ] 代码注释完整
- [ ] 组件文档完整
- [ ] API 文档完整

## ✅ 静态导出验证

### 输出目录检查
```bash
ls -la out/
```

- [ ] `out/index.html` 存在
- [ ] `out/cases/index.html` 存在
- [ ] `out/workshop/index.html` 存在
- [ ] `out/_redirects` 存在
- [ ] `out/_next/static/` 存在

### 路由验证
- [ ] 所有静态路由已生成
- [ ] 所有动态路由已生成
- [ ] 404 页面存在

### 本地预览
```bash
npx serve out
# 访问 http://localhost:3000
```

- [ ] 首页可访问
- [ ] 所有页面可访问
- [ ] 路由跳转正常
- [ ] 静态资源加载正常

## ✅ API 测试

### DeepSeek API
- [ ] 配置 DeepSeek API
- [ ] 测试选题生成
- [ ] 测试文献生成
- [ ] 测试学生对话
- [ ] 测试分析生成

### 错误处理
- [ ] 无效 API Key 错误提示
- [ ] 网络错误提示
- [ ] 速率限制提示
- [ ] 重试功能正常

## ✅ localStorage 测试

### 数据持久化
- [ ] API 配置保存和恢复
- [ ] 研究会话保存和恢复
- [ ] 对话历史保存和恢复
- [ ] 跨页面刷新数据保持

### 配额管理
- [ ] 配额检测正常
- [ ] 配额不足警告
- [ ] 自动清理功能
- [ ] 手动清理功能

## ✅ 错误处理

### 用户友好错误
- [ ] 所有错误有清晰提示
- [ ] 错误提示包含解决方案
- [ ] 重试功能可用
- [ ] 错误不会导致崩溃

### 错误日志
- [ ] 错误记录到控制台
- [ ] 错误信息不包含敏感数据
- [ ] 错误堆栈可追踪

## ✅ 部署准备

### Git 仓库
```bash
git status
git log --oneline -5
```

- [ ] 所有更改已提交
- [ ] Commit 信息清晰
- [ ] 分支状态正确
- [ ] 已推送到远程仓库

### 版本标签
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

- [ ] 版本号已更新
- [ ] Git tag 已创建
- [ ] Tag 已推送

### 部署平台
- [ ] Netlify 账号已准备
- [ ] 仓库已连接
- [ ] 构建设置已配置
- [ ] 环境变量已配置（如需要）

## ✅ 部署后验证

### 基本功能
- [ ] 网站可访问
- [ ] 所有页面加载正常
- [ ] 导航功能正常
- [ ] API 调用正常

### 完整流程
- [ ] 配置 API
- [ ] 完成一次完整研究流程
- [ ] 导出 PDF
- [ ] 会话管理

### 性能监控
- [ ] 页面加载速度正常
- [ ] API 响应速度正常
- [ ] 无控制台错误
- [ ] 无网络错误

## ✅ 监控和维护

### 设置监控
- [ ] Uptime 监控（如 UptimeRobot）
- [ ] 错误追踪（如 Sentry）
- [ ] 分析工具（如 Google Analytics）

### 备份计划
- [ ] Git 仓库备份
- [ ] 文档备份
- [ ] 配置备份

## 📋 部署检查表

在部署前，请确认以下所有项目：

```
[ ] 代码质量检查完成
[ ] 功能测试通过
[ ] 浏览器兼容性测试通过
[ ] 响应式设计测试通过
[ ] 性能优化完成
[ ] 安全检查通过
[ ] 配置文件检查完成
[ ] 文档完整性检查完成
[ ] 静态导出验证通过
[ ] API 测试通过
[ ] localStorage 测试通过
[ ] 错误处理测试通过
[ ] 部署准备完成
```

## 🚀 部署命令

### 本地验证
```bash
# 1. 清理旧构建
rm -rf .next out

# 2. 安装依赖
npm ci

# 3. 运行 lint
npm run lint

# 4. 构建项目
npm run build

# 5. 验证构建
npm run validate

# 6. 本地预览
npx serve out
```

### Netlify 部署
```bash
# 方法 1: Git 推送（自动部署）
git push origin main

# 方法 2: CLI 部署
netlify deploy --prod

# 方法 3: 拖拽部署
# 访问 https://app.netlify.com/drop
# 拖拽 out 目录
```

## 📊 部署后检查

部署完成后，立即进行以下检查：

1. **访问生产 URL**
   - [ ] 网站可访问
   - [ ] HTTPS 正常
   - [ ] 无证书错误

2. **功能快速测试**
   - [ ] 首页加载
   - [ ] 案例馆访问
   - [ ] 工坊功能
   - [ ] API 配置

3. **性能检查**
   - [ ] 运行 Lighthouse
   - [ ] 检查加载时间
   - [ ] 检查资源大小

4. **错误监控**
   - [ ] 检查浏览器控制台
   - [ ] 检查网络请求
   - [ ] 检查错误日志

## 🆘 回滚计划

如果部署后发现严重问题：

### Netlify 回滚
1. 访问 Netlify Dashboard
2. 选择项目
3. 点击 "Deploys"
4. 找到上一个稳定版本
5. 点击 "Publish deploy"

### Git 回滚
```bash
# 回滚到上一个 commit
git revert HEAD
git push origin main

# 或回滚到特定版本
git reset --hard <commit-hash>
git push origin main --force
```

## 📝 部署记录

记录每次部署的信息：

```
部署日期: YYYY-MM-DD HH:MM
部署版本: v1.0.0
部署人员: [姓名]
部署平台: Netlify
部署 URL: https://your-site.netlify.app
Git Commit: [commit-hash]
测试状态: ✅ 通过
备注: [特殊说明]
```

## ✅ 最终确认

在点击部署按钮前，请最后确认：

- [ ] 我已完成所有检查项
- [ ] 我已在本地测试所有功能
- [ ] 我已准备好回滚计划
- [ ] 我已通知相关人员
- [ ] 我已准备好监控部署

**确认无误后，可以开始部署！** 🚀

---

**祝部署顺利！如有问题，请参考 DEPLOYMENT_GUIDE.md 或提交 Issue。**
