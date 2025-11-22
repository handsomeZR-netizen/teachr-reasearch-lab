# Git 推送指南 (Git Push Guide)

## 🚨 当前问题

无法连接到 GitHub（网络问题）

## ✅ 已完成的操作

1. ✅ 所有文件已添加到 Git
2. ✅ 已创建提交（79 个文件，17324 行新增）
3. ✅ 已创建备份文件：`../teacher-research-lab-backup.bundle`

## 🔧 解决方案

### 方案 1: 配置代理（推荐）

如果你使用代理或 VPN：

```bash
# 查看当前代理端口（通常是 7890 或 1080）
# 然后配置 Git 代理

# HTTP 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 或 SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:7890
git config --global https.proxy socks5://127.0.0.1:7890

# 配置后重试推送
git push -u origin main
```

### 方案 2: 使用 SSH

```bash
# 1. 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 复制公钥
cat ~/.ssh/id_ed25519.pub

# 3. 在 GitHub 添加 SSH 密钥
# 访问: https://github.com/settings/keys
# 点击 "New SSH key"，粘贴公钥

# 4. 更改远程仓库 URL
git remote set-url origin git@github.com:handsomeZR-netizen/teachr-reasearch-lab.git

# 5. 推送
git push -u origin main
```

### 方案 3: 修改 hosts 文件

1. 以管理员身份打开记事本
2. 打开文件：`C:\Windows\System32\drivers\etc\hosts`
3. 添加以下行：
   ```
   140.82.113.4 github.com
   140.82.114.4 github.com
   ```
4. 保存文件
5. 重试推送：
   ```bash
   git push -u origin main
   ```

### 方案 4: 使用 GitHub Desktop

1. 下载 [GitHub Desktop](https://desktop.github.com/)
2. 安装并登录
3. 添加本地仓库（File → Add Local Repository）
4. 选择 `code` 目录
5. 点击 "Push origin" 按钮

### 方案 5: 使用 GitHub CLI

```bash
# 安装 GitHub CLI
winget install --id GitHub.cli

# 登录
gh auth login

# 推送
git push -u origin main
```

## 📦 备份文件说明

已创建备份文件：`teacher-research-lab-backup.bundle`

### 恢复备份
```bash
# 在新位置克隆
git clone teacher-research-lab-backup.bundle new-folder

# 或添加远程仓库后推送
cd new-folder
git remote add origin https://github.com/handsomeZR-netizen/teachr-reasearch-lab.git
git push -u origin main
```

## 🔍 诊断命令

### 检查网络连接
```bash
# 测试 GitHub 连接
ping github.com

# 测试 HTTPS 连接
curl -I https://github.com

# 查看 Git 配置
git config --list
```

### 检查代理设置
```bash
# 查看当前代理
git config --get http.proxy
git config --get https.proxy

# 取消代理（如果需要）
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 📝 推送命令（网络正常后）

```bash
# 确保在 code 目录
cd code

# 查看状态
git status

# 推送到 GitHub
git push -u origin main

# 如果推送成功，你会看到：
# Enumerating objects: ...
# Counting objects: ...
# Writing objects: ...
# To https://github.com/handsomeZR-netizen/teachr-reasearch-lab.git
#  * [new branch]      main -> main
```

## 🎯 推送后验证

推送成功后，访问你的 GitHub 仓库：
https://github.com/handsomeZR-netizen/teachr-reasearch-lab

应该能看到：
- ✅ 79 个文件
- ✅ 最新提交信息
- ✅ README.md 显示项目介绍
- ✅ 所有代码文件

## 🚀 推送成功后的下一步

### 1. 配置 Netlify 自动部署

1. 访问 [Netlify](https://app.netlify.com/)
2. 点击 "Add new site" → "Import an existing project"
3. 选择 GitHub
4. 选择 `teachr-reasearch-lab` 仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `out`
   - Base directory: `code`
6. 点击 "Deploy site"

### 2. 设置自定义域名（可选）

在 Netlify 项目设置中：
1. 点击 "Domain settings"
2. 点击 "Add custom domain"
3. 输入你的域名
4. 按照提示配置 DNS

### 3. 启用 HTTPS

Netlify 会自动为你的网站配置 HTTPS 证书。

## 💡 常见问题

### Q: 推送很慢怎么办？
A: 
1. 使用代理
2. 使用 SSH 而不是 HTTPS
3. 压缩推送：`git config --global core.compression 9`

### Q: 推送被拒绝（rejected）？
A: 
```bash
# 先拉取远程更改
git pull origin main --rebase

# 然后推送
git push -u origin main
```

### Q: 忘记添加文件？
A: 
```bash
# 添加遗漏的文件
git add forgotten-file.txt

# 修改最后一次提交
git commit --amend --no-edit

# 强制推送（如果已经推送过）
git push -f origin main
```

### Q: 想要撤销推送？
A: 
```bash
# 回退到上一个提交
git reset --hard HEAD~1

# 强制推送
git push -f origin main
```

## 📞 获取帮助

如果以上方法都不行：

1. **检查防火墙**: 确保防火墙没有阻止 Git
2. **检查杀毒软件**: 某些杀毒软件会阻止 Git 连接
3. **使用移动热点**: 尝试使用手机热点连接
4. **联系网络管理员**: 如果在公司网络，可能需要特殊配置

## 🎉 成功标志

推送成功后，你会看到类似输出：

```
Enumerating objects: 113, done.
Counting objects: 100% (113/113), done.
Delta compression using up to 20 threads
Compressing objects: 100% (109/109), done.
Writing objects: 100% (113/113), 187.66 KiB | 3.99 MiB/s, done.
Total 113 (delta 4), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (4/4), done.
To https://github.com/handsomeZR-netizen/teachr-reasearch-lab.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

**提示**: 如果网络问题持续，建议使用 GitHub Desktop 或等待网络恢复后再推送。代码已经安全地提交到本地仓库并创建了备份文件。
