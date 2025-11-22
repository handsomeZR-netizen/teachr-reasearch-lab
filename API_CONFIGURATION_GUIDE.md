# API 配置指南 (API Configuration Guide)

本指南详细说明如何配置和使用不同的 AI 服务提供商。

## 📋 目录

- [为什么需要配置 API](#为什么需要配置-api)
- [支持的 AI 提供商](#支持的-ai-提供商)
- [DeepSeek 配置（推荐）](#deepseek-配置推荐)
- [OpenAI 配置](#openai-配置)
- [自定义 API 配置](#自定义-api-配置)
- [配置步骤](#配置步骤)
- [常见问题](#常见问题)
- [安全建议](#安全建议)

## 为什么需要配置 API

模拟教学研究实验室是一个纯前端应用，所有 AI 功能都通过调用第三方 API 实现。配置 API 密钥后，你可以：

- ✅ **无限制使用**: 不受共享额度限制
- ✅ **更快响应**: 专属 API 调用，无需排队
- ✅ **数据隐私**: 直接调用 API，数据不经过第三方
- ✅ **自主控制**: 选择喜欢的 AI 模型和提供商

## 支持的 AI 提供商

| 提供商 | 推荐度 | 价格 | 特点 |
|--------|--------|------|------|
| **DeepSeek** | ⭐⭐⭐⭐⭐ | 极低 | 中文友好，性价比最高，支持 CORS |
| **OpenAI** | ⭐⭐⭐⭐ | 较高 | 模型强大，但需要代理或 CORS 配置 |
| **自定义** | ⭐⭐⭐ | 不定 | 兼容 OpenAI API 格式的任何服务 |

## DeepSeek 配置（推荐）

DeepSeek 是最推荐的选择，原因：
- 💰 **价格极低**: 约 ¥0.001/1K tokens（比 GPT-4 便宜 100 倍）
- 🇨🇳 **中文优化**: 专为中文场景优化
- 🌐 **支持 CORS**: 可直接从浏览器调用
- ⚡ **响应快速**: 国内访问速度快

### 步骤 1: 注册 DeepSeek 账号

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 点击右上角"注册"
3. 使用邮箱或手机号注册
4. 完成邮箱/手机验证

### 步骤 2: 获取 API Key

1. 登录后，点击右上角头像
2. 选择"API Keys"
3. 点击"创建新密钥"
4. 输入密钥名称（如"教学实验室"）
5. 复制生成的 API Key（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxx`）

⚠️ **重要**: API Key 只显示一次，请立即保存！

### 步骤 3: 充值（可选）

DeepSeek 新用户通常有免费额度，如需更多：

1. 点击"充值"
2. 选择充值金额（建议 ¥10 起）
3. 使用支付宝/微信支付
4. 充值后即可使用

### 步骤 4: 在应用中配置

在模拟教学研究实验室中：

1. 点击右上角设置图标 ⚙️
2. 填写以下信息：

```
Provider: deepseek
Base URL: https://api.deepseek.com/v1
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxx
Model: deepseek-chat
```

3. 点击"保存配置"
4. 测试功能（如生成选题）

### DeepSeek 模型选择

| 模型名称 | 适用场景 | 价格 |
|----------|----------|------|
| `deepseek-chat` | 通用对话（推荐） | ¥0.001/1K tokens |
| `deepseek-coder` | 代码相关 | ¥0.001/1K tokens |

**推荐使用 `deepseek-chat`**，适合教学场景。

## OpenAI 配置

OpenAI 提供最强大的模型，但价格较高且需要特殊配置。

### 步骤 1: 注册 OpenAI 账号

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册账号（需要国外手机号或邮箱）
3. 完成身份验证

### 步骤 2: 获取 API Key

1. 登录后，访问 [API Keys 页面](https://platform.openai.com/api-keys)
2. 点击"Create new secret key"
3. 输入名称，点击"Create"
4. 复制 API Key（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxx`）

### 步骤 3: 充值

OpenAI 需要绑定信用卡：

1. 访问 [Billing 页面](https://platform.openai.com/account/billing)
2. 点击"Add payment method"
3. 输入信用卡信息
4. 设置自动充值或手动充值

### 步骤 4: 配置 CORS 代理（重要）

⚠️ **OpenAI API 不支持浏览器直接调用**，需要使用代理。

#### 选项 1: 使用第三方代理（简单）

```
Provider: openai
Base URL: https://api.openai-proxy.com/v1
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxx
Model: gpt-4
```

常见代理服务：
- `https://api.openai-proxy.com/v1`
- `https://openai.1rmb.tk/v1`

⚠️ **安全提示**: 使用第三方代理有泄露 API Key 的风险！

#### 选项 2: 自建代理（推荐）

使用 Cloudflare Workers 搭建免费代理：

1. 注册 [Cloudflare](https://www.cloudflare.com/)
2. 创建 Worker
3. 粘贴以下代码：

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'api.openai.com';
    
    const newRequest = new Request(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    const response = await fetch(newRequest);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', '*');
    
    return newResponse;
  },
};
```

4. 部署 Worker，获取 URL（如 `https://your-worker.workers.dev`）
5. 在应用中使用：

```
Provider: openai
Base URL: https://your-worker.workers.dev/v1
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxx
Model: gpt-4
```

### OpenAI 模型选择

| 模型名称 | 适用场景 | 价格（输入/输出） |
|----------|----------|-------------------|
| `gpt-4` | 最强性能 | $0.03/$0.06 per 1K tokens |
| `gpt-4-turbo` | 性能与速度平衡 | $0.01/$0.03 per 1K tokens |
| `gpt-3.5-turbo` | 快速且便宜 | $0.0005/$0.0015 per 1K tokens |

**推荐**: 
- 预算充足：`gpt-4-turbo`
- 预算有限：`gpt-3.5-turbo`

## 自定义 API 配置

如果你使用其他兼容 OpenAI API 格式的服务（如 Azure OpenAI、本地模型等），可以使用自定义配置。

### 兼容的服务

- **Azure OpenAI Service**
- **Anthropic Claude**（需要适配器）
- **本地模型**（Ollama、LM Studio）
- **其他第三方服务**

### 配置示例

#### Azure OpenAI

```
Provider: custom
Base URL: https://your-resource.openai.azure.com/openai/deployments/your-deployment
API Key: your-azure-api-key
Model: gpt-4
```

#### Ollama（本地模型）

```
Provider: custom
Base URL: http://localhost:11434/v1
API Key: ollama
Model: llama2
```

#### LM Studio（本地模型）

```
Provider: custom
Base URL: http://localhost:1234/v1
API Key: lm-studio
Model: local-model
```

## 配置步骤

### 在应用中配置

1. **打开设置对话框**
   - 点击右上角的设置图标 ⚙️
   - 或访问任何页面时点击导航栏的设置按钮

2. **填写配置信息**
   - **Provider**: 选择提供商（deepseek/openai/custom）
   - **Base URL**: API 端点地址
   - **API Key**: 你的 API 密钥
   - **Model**: 模型名称

3. **保存配置**
   - 点击"保存配置"按钮
   - 配置会保存在浏览器 localStorage 中

4. **测试配置**
   - 进入"研究工坊"
   - 尝试生成选题
   - 如果成功，说明配置正确

### 配置验证

保存后，系统会自动验证配置：

- ✅ **成功**: 显示"配置已保存"提示
- ❌ **失败**: 显示错误信息，请检查：
  - API Key 是否正确
  - Base URL 是否正确
  - 网络连接是否正常
  - API 额度是否充足

## 常见问题

### Q1: API Key 保存在哪里？

A: API Key 保存在浏览器的 localStorage 中，只存在于你的设备上，不会上传到任何服务器。

### Q2: 如何查看我的 API 使用量？

A: 访问对应平台的控制台：
- DeepSeek: [Usage Dashboard](https://platform.deepseek.com/usage)
- OpenAI: [Usage Dashboard](https://platform.openai.com/usage)

### Q3: API 调用失败怎么办？

A: 检查以下几点：
1. API Key 是否有效
2. 账户余额是否充足
3. Base URL 是否正确
4. 网络连接是否正常
5. 浏览器控制台是否有错误信息

### Q4: 可以使用免费的 API 吗？

A: 
- DeepSeek 新用户有免费额度
- OpenAI 新用户有 $5 免费额度（有时间限制）
- 部分第三方服务提供免费层级

### Q5: 如何切换不同的 API？

A: 
1. 打开设置对话框
2. 修改配置信息
3. 保存新配置
4. 立即生效，无需刷新页面

### Q6: API Key 会过期吗？

A: 
- DeepSeek: 不会过期，除非手动删除
- OpenAI: 不会过期，除非手动删除
- 建议定期轮换 API Key 以提高安全性

### Q7: 多个设备可以共享 API Key 吗？

A: 可以，但需要在每个设备上分别配置。API Key 不会自动同步。

### Q8: 如何估算使用成本？

A: 
- **选题生成**: 约 500 tokens，DeepSeek ≈ ¥0.0005
- **文献综述**: 约 1500 tokens，DeepSeek ≈ ¥0.0015
- **学生对话**: 每轮约 300 tokens，DeepSeek ≈ ¥0.0003
- **分析报告**: 约 1000 tokens，DeepSeek ≈ ¥0.001

**示例**: 完成一次完整研究流程（包含 20 轮对话），DeepSeek 约 ¥0.01，OpenAI GPT-4 约 ¥1。

## 安全建议

### 保护你的 API Key

1. **不要分享**: 永远不要在公共场合分享 API Key
2. **定期轮换**: 建议每 3-6 个月更换一次
3. **设置限额**: 在平台设置每月使用上限
4. **监控使用**: 定期检查使用量，发现异常及时处理

### 如果 API Key 泄露

1. **立即删除**: 在平台删除泄露的 API Key
2. **创建新密钥**: 生成新的 API Key
3. **更新配置**: 在应用中更新为新密钥
4. **检查账单**: 查看是否有异常使用

### 浏览器安全

- ✅ 使用 HTTPS 访问应用
- ✅ 不在公共电脑上保存 API Key
- ✅ 定期清理浏览器缓存
- ❌ 不要在隐私模式下配置（数据会丢失）

## 推荐配置方案

### 个人使用（预算有限）

```
Provider: deepseek
Base URL: https://api.deepseek.com/v1
API Key: your-deepseek-key
Model: deepseek-chat
```

**成本**: 约 ¥10 可使用数月

### 团队使用（追求质量）

```
Provider: openai
Base URL: https://your-proxy.workers.dev/v1
API Key: your-openai-key
Model: gpt-4-turbo
```

**成本**: 约 $20/月（中等使用量）

### 教育机构（大规模使用）

考虑：
1. 申请 OpenAI 教育折扣
2. 使用 Azure OpenAI（企业级支持）
3. 自建模型服务（长期成本更低）

## 技术细节

### API 请求格式

应用使用标准的 OpenAI API 格式：

```javascript
POST {baseURL}/chat/completions
Headers:
  Authorization: Bearer {apiKey}
  Content-Type: application/json

Body:
{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "temperature": 0.7,
  "stream": true
}
```

### 支持的功能

- ✅ 流式响应（SSE）
- ✅ 对话历史
- ✅ 系统提示词
- ✅ Temperature 控制
- ✅ Max tokens 限制

### CORS 要求

API 端点必须支持以下 CORS 头：

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 获取帮助

- 📧 **DeepSeek 支持**: support@deepseek.com
- 📧 **OpenAI 支持**: https://help.openai.com/
- 💬 **项目 Issues**: 在 GitHub 提交问题
- 📖 **文档**: 查看项目 README

---

**配置完成后，你就可以开始使用模拟教学研究实验室了！祝研究顺利！** 🎉
