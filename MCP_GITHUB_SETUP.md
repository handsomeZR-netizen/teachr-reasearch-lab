# GitHub MCP 服务器配置指南

## 🎯 为什么使用 GitHub MCP？

### 当前问题
- ❌ 网络无法连接到 GitHub
- ❌ 命令行推送失败
- ❌ 需要手动处理认证

### MCP 解决方案
- ✅ 自动化 Git 工作流
- ✅ 智能处理网络问题
- ✅ AI 辅助提交和推送
- ✅ 更好的错误处理

## 📦 推荐的 MCP 服务器

### 方案 1: Git Workflow MCP Server（推荐）

**特点**：
- 专门为 Git 工作流设计
- 支持提交、推送、创建 PR
- 有 dry-run 模式（安全预览）
- 自动处理 GitHub 认证

**安装**：
```bash
npm install -g git-workflow-mcp-server
```

**配置 Kiro MCP**：

在 `.kiro/settings/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "git-workflow": {
      "command": "git-workflow-mcp-server",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "你的GitHub个人访问令牌"
      },
      "disabled": false,
      "autoApprove": [
        "git_commit_and_push",
        "create_pull_request"
      ]
    }
  }
}
```

### 方案 2: GitHub MCP Server（官方）

**特点**：
- GitHub 官方支持
- 功能全面（仓库、Issue、PR）
- 持续更新

**配置 Kiro MCP**：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "你的令牌"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## 🔑 获取 GitHub 个人访问令牌（PAT）

### 步骤 1: 创建令牌

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置：
   - **Note**: `Kiro MCP Server`
   - **Expiration**: `90 days`
   - **勾选权限**：
     - ✅ `repo` (完整仓库访问)
     - ✅ `workflow` (工作流)
     - ✅ `write:packages` (包写入)
4. 点击 "Generate token"
5. **复制令牌**（只显示一次！）

### 步骤 2: 保存令牌

**安全存储**：
```bash
# Windows
setx GITHUB_TOKEN "你的令牌"

# 或在 .env 文件中
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

## 🎮 使用 MCP 推送代码

### 方法 1: 通过 Kiro 对话

配置好 MCP 后，你可以直接对 Kiro 说：

```
"帮我把代码推送到 GitHub"
"提交所有更改并推送到 main 分支"
"创建一个 PR 到 main 分支"
```

Kiro 会自动调用 MCP 工具完成操作！

### 方法 2: 使用 MCP 工具

在 Kiro 中：

```typescript
// 提交并推送
use_mcp_tool("git-workflow", "git_commit_and_push", {
  "files": ["*"],
  "commitMessage": "feat: 完成所有功能改进",
  "branch": "main",
  "dryRun": false
})

// 创建 PR
use_mcp_tool("git-workflow", "create_pull_request", {
  "title": "完成所有功能改进",
  "body": "添加返回键、Framer Motion动画、引导教学系统、修复焦点问题",
  "baseBranch": "main",
  "headBranch": "feature/improvements"
})
```

## 📝 完整配置示例

### .kiro/settings/mcp.json

```json
{
  "mcpServers": {
    "git-workflow": {
      "command": "git-workflow-mcp-server",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      },
      "disabled": false,
      "autoApprove": [
        "git_commit_and_push"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 环境变量设置

创建 `.env` 文件（在项目根目录）：

```env
GITHUB_TOKEN=ghp_your_token_here
```

## 🔧 故障排查

### MCP 服务器无法启动

1. **检查安装**：
   ```bash
   npm list -g git-workflow-mcp-server
   ```

2. **重新安装**：
   ```bash
   npm uninstall -g git-workflow-mcp-server
   npm install -g git-workflow-mcp-server
   ```

3. **检查 Node.js 版本**：
   ```bash
   node --version  # 需要 >= 18
   ```

### 认证失败

1. **检查令牌**：
   - 确保令牌有正确的权限
   - 确保令牌未过期

2. **测试令牌**：
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```

3. **重新生成令牌**：
   - 如果令牌失效，重新生成

### 网络问题

MCP 服务器也可能遇到网络问题：

1. **配置代理**：
   ```json
   {
     "mcpServers": {
       "git-workflow": {
         "env": {
           "HTTP_PROXY": "http://127.0.0.1:7890",
           "HTTPS_PROXY": "http://127.0.0.1:7890"
         }
       }
     }
   }
   ```

2. **使用 GitHub Desktop 作为备选**

## 🎯 推荐工作流

### 日常开发

1. **在 Kiro 中开发代码**
2. **对 Kiro 说**："帮我提交并推送代码"
3. **Kiro 自动**：
   - 检测更改的文件
   - 生成合适的 commit 信息
   - 提交并推送到 GitHub
4. **完成！**

### 创建 PR

1. **对 Kiro 说**："创建一个 PR"
2. **Kiro 自动**：
   - 分析代码更改
   - 生成 PR 标题和描述
   - 创建 Pull Request
3. **在 GitHub 上审查和合并**

## 💡 最佳实践

### 1. 使用 Dry Run

在第一次使用时，先用 dry-run 模式：

```typescript
use_mcp_tool("git-workflow", "git_commit_and_push", {
  "files": ["*"],
  "commitMessage": "test commit",
  "dryRun": true  // 只预览，不实际执行
})
```

### 2. 分批提交

不要一次提交所有文件：

```typescript
// 先提交核心代码
use_mcp_tool("git-workflow", "git_commit_and_push", {
  "files": ["src/**/*.tsx", "lib/**/*.ts"],
  "commitMessage": "feat: add core features"
})

// 再提交文档
use_mcp_tool("git-workflow", "git_commit_and_push", {
  "files": ["*.md"],
  "commitMessage": "docs: update documentation"
})
```

### 3. 定期备份

即使使用 MCP，也要定期创建本地备份：

```bash
git bundle create backup-$(date +%Y%m%d).bundle --all
```

## 🆚 MCP vs 传统方法

| 特性 | 传统 Git 命令 | GitHub MCP |
|------|--------------|------------|
| 易用性 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 自动化 | ❌ | ✅ |
| AI 辅助 | ❌ | ✅ |
| 错误处理 | ⭐⭐ | ⭐⭐⭐⭐ |
| 学习曲线 | 陡峭 | 平缓 |
| 网络问题 | 需手动处理 | 自动重试 |

## 🎉 总结

### 推荐使用 GitHub MCP 的原因

1. ✅ **自动化**：AI 帮你处理 Git 操作
2. ✅ **智能**：自动生成 commit 信息
3. ✅ **简单**：只需对话，无需记命令
4. ✅ **可靠**：更好的错误处理
5. ✅ **高效**：节省时间和精力

### 当前最佳方案

**短期**（立即推送）：
- 使用 **GitHub Desktop**（最可靠）

**长期**（日常开发）：
- 配置 **Git Workflow MCP Server**
- 享受 AI 辅助的 Git 工作流

### 下一步

1. **立即**：使用 GitHub Desktop 推送当前代码
2. **然后**：配置 Git Workflow MCP Server
3. **未来**：享受自动化的 Git 工作流

---

**记住**：MCP 是工具，不是魔法。网络问题仍需解决，但 MCP 可以让 Git 操作更简单、更智能！
