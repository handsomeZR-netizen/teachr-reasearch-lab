# 云端 API 配置说明

## 更新内容

本次更新实现了云端部署时自动使用默认 API Key 的功能，用户无需手动配置即可使用应用。

## 功能特性

### 1. 自动 API 配置

- 部署到 Netlify 后，应用会自动使用预配置的 DeepSeek API Key
- 用户首次访问无需任何配置，可以直接使用所有功能
- 默认 API Key: `sk-b363adbc72a44d47b02f9c1cc48afb47`

### 2. API Key 优先级

系统按以下优先级选择 API Key：

```
用户自定义配置 > 环境变量 > 默认配置
```

1. **用户自定义配置**（最高优先级）
   - 用户在应用设置中手动配置的 API Key
   - 存储在浏览器 localStorage
   - 会覆盖默认的云端 API

2. **环境变量**（中等优先级）
   - 部署时通过 `netlify.toml` 或 Netlify 控制台配置
   - 对所有用户生效
   - 适合提供免费的共享 API

3. **默认配置**（最低优先级）
   - 代码中的 fallback 配置
   - 通常为空，提示用户配置

### 3. 用户体验优化

#### 首次访问
- ✅ 无需配置，直接使用
- ✅ 所有功能立即可用
- ✅ 零学习成本

#### 配置提示
- 在 API 配置对话框中显示当前使用状态
- 如果使用默认 API，会提示用户可以配置自己的 API Key
- 说明免费 API 的限制和自定义 API 的优势

#### 自定义配置
- 用户可以随时配置自己的 API Key
- 配置后会覆盖默认 API
- 支持 DeepSeek、OpenAI 和自定义提供商

## 技术实现

### 1. 环境变量配置

在 `netlify.toml` 中添加：

```toml
[build.environment]
  NODE_VERSION = "20"
  NEXT_PUBLIC_DEFAULT_API_KEY = "sk-b363adbc72a44d47b02f9c1cc48afb47"
  NEXT_PUBLIC_DEFAULT_API_BASE_URL = "https://api.deepseek.com/v1"
  NEXT_PUBLIC_DEFAULT_API_MODEL = "deepseek-chat"
```

### 2. 配置存储逻辑

修改 `lib/stores/use-config-store.ts`：

```typescript
// 从环境变量获取默认配置
const getDefaultConfig = (): APIConfig => {
  const envApiKey = process.env.NEXT_PUBLIC_DEFAULT_API_KEY;
  const envBaseURL = process.env.NEXT_PUBLIC_DEFAULT_API_BASE_URL;
  const envModel = process.env.NEXT_PUBLIC_DEFAULT_API_MODEL;
  
  return {
    provider: 'deepseek',
    baseURL: envBaseURL || 'https://api.deepseek.com/v1',
    apiKey: envApiKey || '',
    model: envModel || 'deepseek-chat',
  };
};

// 获取配置时的优先级处理
getDecryptedConfig: () => {
  const state = get();
  const defaultConfig = getDefaultConfig();
  
  // 用户配置优先
  if (state.apiConfig?.apiKey) {
    return state.apiConfig;
  }
  
  // 否则使用环境变量
  return defaultConfig;
}
```

### 3. UI 提示

修改 `components/api-config-dialog.tsx`：

```typescript
// 检测是否使用默认 API
const isUsingDefaultAPI = !apiConfig?.apiKey && process.env.NEXT_PUBLIC_DEFAULT_API_KEY;

// 显示提示信息
{isUsingDefaultAPI && (
  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
    <p className="font-medium text-primary">当前使用免费云端 API</p>
    <p>您可以配置自己的 API Key 以解除限制并获得更好的性能。</p>
  </div>
)}
```

## 部署步骤

### 1. 提交代码

```bash
git add .
git commit -m "Add cloud API configuration"
git push origin main
```

### 2. Netlify 自动部署

- Netlify 检测到代码更新
- 自动触发构建
- 使用 Node.js 20 构建
- 读取 `netlify.toml` 中的环境变量
- 部署到生产环境

### 3. 验证部署

访问部署的 URL，测试：

1. ✅ 首页正常加载
2. ✅ 无需配置即可使用选题生成
3. ✅ 文献综述功能正常
4. ✅ 学生对话模拟正常
5. ✅ 打开 API 配置对话框，显示"当前使用免费云端 API"提示

## 安全说明

### 免费 API 的限制

- 默认 API Key 是共享的，所有用户共用
- 有调用次数和频率限制
- 可能在高峰期响应较慢
- 建议用户配置自己的 API Key 以获得更好体验

### API Key 存储安全

- 环境变量中的 API Key 在构建时注入到前端代码
- 用户可以在浏览器中看到这个 Key（通过查看源代码）
- 因此只能使用有限额度的免费 Key
- 不要在环境变量中放置重要的付费 API Key

### 用户自定义 API Key 安全

- 用户配置的 API Key 使用 Base64 编码存储在 localStorage
- 仅在客户端使用，不会上传到服务器
- 建议用户在安全的设备上使用

## 更新 API Key

### 方法 1: 修改 netlify.toml

```toml
[build.environment]
  NEXT_PUBLIC_DEFAULT_API_KEY = "新的-api-key"
```

提交并推送代码，Netlify 会自动重新部署。

### 方法 2: Netlify 控制台

1. 登录 Netlify
2. 进入项目设置
3. **Site settings** → **Environment variables**
4. 修改 `NEXT_PUBLIC_DEFAULT_API_KEY` 的值
5. 点击 **"Trigger deploy"** 重新部署

## 故障排查

### 问题 1: 环境变量未生效

**症状**: 部署后仍然提示配置 API

**解决方法**:
1. 检查环境变量名称是否以 `NEXT_PUBLIC_` 开头
2. 在 Netlify 部署日志中确认环境变量已设置
3. 清除浏览器缓存并刷新页面
4. 重新部署站点

### 问题 2: API 调用失败

**症状**: 使用默认 API 时报错

**可能原因**:
- API Key 已过期或额度用完
- API 服务暂时不可用
- 网络连接问题

**解决方法**:
1. 检查 API Key 是否有效
2. 在 [DeepSeek 控制台](https://platform.deepseek.com/) 查看额度
3. 建议用户配置自己的 API Key
4. 更新 `netlify.toml` 中的 API Key

### 问题 3: 用户配置无法覆盖默认 API

**症状**: 配置了自己的 API Key 但仍使用默认 API

**解决方法**:
1. 清除浏览器 localStorage
2. 重新配置 API Key
3. 检查浏览器控制台是否有错误
4. 确认配置已保存（localStorage 中应该有 `api-config` 项）

## 相关文档

- [环境变量配置指南](./ENVIRONMENT_VARIABLES.md) - 详细的环境变量配置说明
- [API 配置指南](./API_CONFIGURATION_GUIDE.md) - 用户端 API 配置教程
- [部署指南](./DEPLOYMENT_GUIDE.md) - 完整的部署流程

## 总结

通过这次更新，应用实现了：

✅ 云端部署后开箱即用
✅ 用户无需配置即可体验所有功能
✅ 保留用户自定义配置的灵活性
✅ 清晰的使用提示和引导
✅ 安全的 API Key 管理

用户体验流程：

1. 访问应用 → 直接使用（使用默认 API）
2. 发现限制 → 查看提示 → 配置自己的 API
3. 配置后 → 使用自己的 API → 无限制使用

这样既降低了使用门槛，又保持了灵活性和可扩展性。
