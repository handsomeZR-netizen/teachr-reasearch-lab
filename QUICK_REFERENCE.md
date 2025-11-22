# 快速参考指南 (Quick Reference Guide)

## 🚀 快速开始

### 本地开发
```bash
cd code
npm install
npm run dev
# 访问 http://localhost:3000
```

### 构建部署
```bash
npm run build
npx serve out
# 或直接部署 out 目录
```

## 📚 关键文档

| 文档 | 说明 |
|------|------|
| `README.md` | 项目主文档 |
| `DEPLOYMENT_GUIDE.md` | 详细部署指南 |
| `API_CONFIGURATION_GUIDE.md` | API 配置说明 |
| `UI_IMPROVEMENTS_SUMMARY.md` | UI 改进总结 |
| `BUGFIX_FOCUS_ISSUE.md` | 焦点问题修复 |
| `FINAL_IMPROVEMENTS_SUMMARY.md` | 最终改进总结 |

## 🎯 核心功能

### 1. 研究工坊（4 步流程）
```
步骤 1: 选题向导 → 步骤 2: 文献综述 → 步骤 3: 模拟课堂 → 步骤 4: 成果导出
```

### 2. 案例馆
- 浏览多学科案例
- 按学科筛选
- Fork 到工坊

### 3. API 配置
- 点击右上角设置图标
- 配置 DeepSeek/OpenAI API
- 保存到 localStorage

## 🎨 动画系统

### 页面动画
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* 内容 */}
</motion.div>
```

### 交互动画
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  {/* 按钮 */}
</motion.div>
```

### 滚动触发
```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  {/* 内容 */}
</motion.div>
```

## 🎓 引导教学

### 使用引导
```tsx
import { OnboardingTour } from '@/components/onboarding-tour';
import { workshopTourSteps } from '@/lib/onboarding-steps';

<OnboardingTour 
  steps={workshopTourSteps} 
  tourId="workshop-main"
/>
```

### 自定义步骤
```tsx
const customSteps: TourStep[] = [
  {
    id: 'step-1',
    target: '#element-id',
    title: '标题',
    content: '说明',
    icon: <Icon />,
    position: 'bottom',
  },
];
```

### 重置引导
```javascript
// 浏览器控制台
localStorage.removeItem('tour-completed-workshop-main');
location.reload();
```

## 🐛 常见问题

### Q: 引导不显示？
```javascript
// 清除所有引导记录
localStorage.clear();
location.reload();
```

### Q: 动画卡顿？
- 使用 `transform` 和 `opacity`
- 避免修改 `width`、`height`
- 减少同时运行的动画

### Q: 焦点跳转？
- 已修复，不应再出现
- 如果复现，检查其他自动聚焦代码

### Q: 构建失败？
```bash
rm -rf .next out node_modules
npm install
npm run build
```

## 📱 响应式断点

```css
/* Tailwind CSS 断点 */
sm: 640px   /* 平板 */
md: 768px   /* 小桌面 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大桌面 */
```

## 🎨 主题颜色

```css
--primary: #006666        /* 主色调 */
--bg-main: #F9F9F7       /* 背景色 */
--text-primary: #1a1a1a  /* 主文字 */
--text-secondary: #666   /* 次要文字 */
--border: #e5e5e5        /* 边框 */
```

## 🔧 开发工具

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

### 构建验证
```bash
npm run validate
```

## 📊 性能优化

### 图片优化
```tsx
// 使用 unoptimized 模式（静态导出）
images: {
  unoptimized: true,
}
```

### 代码分割
```tsx
// 动态导入重型组件
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

### 缓存策略
```tsx
// 使用 API 缓存
import { cachedAPICall, CACHE_KEYS } from '@/lib/api-cache';

const result = await cachedAPICall(
  CACHE_KEYS.TOPICS,
  { key: 'value' },
  async () => {
    // API 调用
  },
  300000 // 5 分钟
);
```

## 🚀 部署命令

### Netlify
```bash
# 方法 1: 拖拽部署
npm run build
# 拖拽 out 目录到 https://app.netlify.com/drop

# 方法 2: CLI 部署
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### 自定义服务器
```bash
npm run build
# 上传 out 目录到服务器
```

## 📞 获取帮助

### 文档
- 查看 `README.md`
- 查看 `DEPLOYMENT_GUIDE.md`
- 查看 `API_CONFIGURATION_GUIDE.md`

### 调试
- 打开浏览器开发者工具（F12）
- 查看 Console 标签的错误
- 查看 Network 标签的请求

### 社区
- GitHub Issues
- 项目文档
- 技术支持

---

**快速参考版本**: 1.0  
**最后更新**: 2024  
**适用版本**: Next.js 16 + Framer Motion
