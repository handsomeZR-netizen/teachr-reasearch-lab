# 环境变量配置指南

## 概述

本应用支持通过环境变量配置默认的 AI API，这样部署到云端后用户可以直接使用，无需手动配置。

## 环境变量列表

### 必需的环境变量

- `NEXT_PUBLIC_DEFAULT_API_KEY` - 默认的 DeepSeek API Key
- `NEXT_PUBLIC_DEFAULT_API_BASE_URL` - API 基础 URL（默认：`https://api.deepseek.com/v1`）
- `NEXT_PUBLIC_DEFAULT_API_MODEL` - 使用的模型名称（默认：`deepseek-chat`）

## Netlify 部署配置

### 方法 1：通过 netlify.toml 配置（已配置）

环境变量已在 `netlify.toml` 中配置：

```toml
[build.environment]
  NODE_VERSION = "20"
  NEXT_PUBLIC_DEFAULT_API_KEY = "sk-b363adbc72a44d47b02f9c1cc48afb47"
  NEXT_PUBLIC_DEFAULT_API_BASE_URL = "https://api.deepseek.com/v1"
  NEXT_PUBLIC_DEFAULT_API_MODEL = "deepseek-chat"
```

### 方法 2：通过 Netlify 控制台配置

1. 登录 Netlify 控制台
2. 进入您的站点设置
3. 导航到 **Site settings** > **Environment variables**
4. 添加以下环境变量：
   - Key: `NEXT_PUBLIC_DEFAULT_API_KEY`
   - Value: `sk-b363adbc72a44d47b02f9c1cc48afb47`
   - Key: `NEXT_PUBLIC_DEFAULT_API_BASE_URL`
   - Value: `https://api.deepseek.com/v1`
   - Key: `NEXT_PUBLIC_DEFAULT_API_MODEL`
   - Value: `deepseek-chat`

5. 保存后重新部署站点

## 工作原理

### API Key 优先级

系统按以下优先级选择 API Key：

1. **用户自定义配置** - 用户在应用中手动配置的 API Key（存储在浏览器 localStorage）
2. **环境变量** - 部署时设置的默认 API Key
3. **空配置** - 如果以上都没有，则提示用户配置

### 用户体验

- **首次访问**：如果设置了环境变量，用户可以直接使用应用，无需配置
- **自定义配置**：用户可以随时在设置中配置自己的 API Key，会覆盖默认配置
- **配置提示**：如果用户正在使用默认 API，配置对话框会显示提示信息

## 安全注意事项

### 免费 API Key 的限制

- 默认的 API Key 是共享的，有调用次数限制
- 建议用户配置自己的 API Key 以获得更好的性能和无限制使用
- 在配置对话框中会显示当前是否使用默认 API

### API Key 存储

- 用户自定义的 API Key 使用 Base64 编码后存储在浏览器 localStorage
- 不会上传到任何服务器
- 仅在客户端使用

## 本地开发

在本地开发时，可以创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_DEFAULT_API_KEY=sk-your-api-key-here
NEXT_PUBLIC_DEFAULT_API_BASE_URL=https://api.deepseek.com/v1
NEXT_PUBLIC_DEFAULT_API_MODEL=deepseek-chat
```

**注意**：`.env.local` 文件不应提交到 Git 仓库。

## 更新 API Key

如果需要更新默认的 API Key：

1. 修改 `netlify.toml` 中的 `NEXT_PUBLIC_DEFAULT_API_KEY` 值
2. 或在 Netlify 控制台更新环境变量
3. 重新部署应用

## 故障排除

### 环境变量未生效

1. 确认环境变量名称以 `NEXT_PUBLIC_` 开头（Next.js 要求）
2. 在 Netlify 控制台检查环境变量是否正确设置
3. 重新部署站点（环境变量更改需要重新构建）

### API 调用失败

1. 检查 API Key 是否有效
2. 检查 API 调用次数是否超限
3. 建议用户配置自己的 API Key

## 相关文档

- [API 配置指南](./API_CONFIGURATION_GUIDE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
