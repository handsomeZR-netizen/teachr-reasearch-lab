# 环境变量配置指南

本项目使用 Netlify Serverless Functions 来安全地代理 API 请求，API Key 存储在服务器端，不会暴露给客户端。

## 环境变量列表

| 变量名 | 描述 | 存储位置 | 必需 |
|--------|------|----------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | Netlify 环境变量（服务器端） | 是（云端模式） |

## Netlify 部署配置

### 步骤 1: 在 Netlify Dashboard 设置环境变量

1. 登录 [Netlify Dashboard](https://app.netlify.com)
2. 选择您的站点
3. 进入 **Site settings** > **Environment variables**
4. 点击 **Add a variable**
5. 添加以下变量：
   - Key: `DEEPSEEK_API_KEY`
   - Value: 您的 DeepSeek API Key（例如：`sk-xxxxxxxxxxxxxxxx`）
6. 点击 **Save**
7. 重新部署站点以使变量生效

### 步骤 2: 验证配置

部署后，访问您的网站：
- 导航栏应显示 "云端" 图标（蓝色云朵）
- 点击设置按钮，应看到 "云端 API 模式" 选项
- 尝试使用研究工坊功能，应能正常调用 AI

## 工作原理

```
用户浏览器 → Netlify Function (api-proxy) → DeepSeek API
                    ↑
              添加 API Key
              (从环境变量读取)
```

1. 用户在浏览器中发起请求
2. 请求发送到 `/.netlify/functions/api-proxy`
3. Serverless Function 从环境变量读取 `DEEPSEEK_API_KEY`
4. Function 将请求转发到 DeepSeek API，附带 API Key
5. 响应返回给用户

这种方式确保 API Key 永远不会暴露在客户端代码中。

## 本地开发配置

### 方法 1: 使用 Netlify CLI（推荐）

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 链接到您的站点
netlify link

# 启动本地开发服务器（会自动加载环境变量）
netlify dev
```

### 方法 2: 创建本地环境变量文件

创建 `.env.local` 文件（不要提交到 Git）：

```bash
DEEPSEEK_API_KEY=your-api-key-here
```

然后使用 Netlify CLI 运行：

```bash
netlify dev
```

### 方法 3: 使用自定义 API Key

在本地开发时，您也可以：
1. 打开网站
2. 点击导航栏的设置按钮
3. 选择 "自定义 API" 模式
4. 输入您自己的 API Key

## 获取 DeepSeek API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com)
2. 注册或登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 Key 并保存

## 安全注意事项

- ✅ API Key 存储在 Netlify 服务器端环境变量中
- ✅ 客户端代码不包含任何 API Key
- ✅ 所有 API 请求通过 Serverless Function 代理
- ⚠️ 永远不要在 `netlify.toml` 或代码中硬编码 API Key
- ⚠️ 定期轮换 API Key
- ⚠️ 监控 API 使用量，防止滥用

## 故障排除

### 问题：API 调用失败，提示 "服务器未配置 API Key"

**原因**：Netlify 环境变量未设置或未生效

**解决方案**：
1. 检查 Netlify Dashboard 中是否正确设置了 `DEEPSEEK_API_KEY`
2. 重新部署站点（Deploys > Trigger deploy > Deploy site）
3. 清除浏览器缓存后重试

### 问题：本地开发时无法使用云端 API

**原因**：本地环境没有 Netlify Functions 支持

**解决方案**：
1. 使用 `netlify dev` 命令启动开发服务器
2. 或者切换到 "自定义 API" 模式，使用您自己的 API Key

## 相关文档

- [API 配置指南](./API_CONFIGURATION_GUIDE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
