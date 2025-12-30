# GitHub Pages 部署指南

本文档说明如何自动部署示例到 GitHub Pages，以便在 GitHub 仓库中显示 demo 链接。

## 🎯 推荐方案：GitHub Actions（免费且更简单）

项目已配置 GitHub Actions 工作流，无需额外配置即可使用！

### ⚠️ 重要：启用 GitHub Pages

**必须先手动启用 GitHub Pages，工作流才能正常部署！**

1. 进入 GitHub 仓库 → **Settings** → **Pages**
2. 在 **Build and deployment** 部分：
   - **Source**: 选择 `GitHub Actions`
3. 点击 **Save** 保存设置

完成此步骤后，GitHub Pages 将被启用，工作流可以正常部署。

### 快速开始

1. **推送代码**
   ```bash
   git push origin main
   # 或
   git push origin master
   ```

2. **查看部署状态**
   - 进入仓库的 **Actions** 标签页
   - 查看 `Deploy to GitHub Pages` 工作流运行状态
   - 部署成功后，访问 `https://你的用户名.github.io/仓库名/`

---

## 备选方案：Travis CI

如果你仍想使用 Travis CI，请参考以下配置：

## 前置条件

1. **GitHub 仓库**：确保项目已推送到 GitHub
2. **Travis CI 账号**：确保项目已连接到 Travis CI
3. **GitHub Token**：需要生成 GitHub Personal Access Token

## 设置步骤

### 1. 生成 GitHub Personal Access Token

1. 登录 GitHub
2. 进入 **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. 点击 **Generate new token (classic)**
4. 填写 Token 描述（如：`Travis CI GitHub Pages Deploy`）
5. 选择权限：
   - ✅ `repo` (完整仓库访问权限)
   - ✅ `public_repo` (如果是公开仓库)
6. 点击 **Generate token**
7. **重要**：复制生成的 token（只显示一次，请妥善保存）

### 2. 配置 Travis CI 环境变量

1. 登录 [Travis CI](https://travis-ci.com/) 或 [Travis CI.org](https://travis-ci.org/)
2. 进入项目设置页面
3. 在 **Environment Variables** 中添加：
   - **Name**: `GITHUB_TOKEN`
   - **Value**: 你的 GitHub Personal Access Token
   - **Display value in build log**: ❌ **不勾选**（安全考虑）

### 3. 启用 GitHub Pages（Travis CI）

1. 进入 GitHub 仓库设置
2. 找到 **Pages** 设置
3. 选择 **Source**: `gh-pages` 分支（Travis CI 会自动创建）
4. 选择 **Folder**: `/ (root)`
5. 点击 **Save**

### 4. 更新仓库信息

确保 `package.json` 中的仓库信息正确：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/chengdick/react-router-v18.git"
  },
  "homepage": "https://chengdick.github.io/react-router-v18"
}
```

## 部署流程

### 自动部署（推荐）

当代码推送到 `master` 分支时，Travis CI 会自动：

1. ✅ 运行测试（lint + test-node）
2. ✅ 构建示例（`npm run build-examples`）
3. ✅ 部署到 GitHub Pages

**触发条件**：
- 推送到 `master` 分支
- 所有测试通过

### 手动触发

如果需要手动触发部署：

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "Update examples"

# 2. 推送到 master 分支
git push origin master

# 3. Travis CI 会自动检测并部署
```

### 使用 Yarn

本项目使用 Yarn 作为包管理器。Travis CI 配置已设置为使用 Yarn：

- `yarn install --frozen-lockfile` - 安装依赖
- `yarn lint` - 运行 lint 检查
- `yarn test-node` - 运行测试
- `yarn build-examples` - 构建示例

## 访问 Demo

部署成功后，可以通过以下链接访问：

- **主页面**: `https://chengdick.github.io/react-router-v18/`
- **示例列表**: `https://chengdick.github.io/react-router-v18/index.html`
- **具体示例**: `https://chengdick.github.io/react-router-v18/active-links/`

## 在 README 中添加 Demo 链接

在 `README.md` 中添加：

```markdown
## 🚀 Live Demo

View live examples on GitHub Pages:

**[👉 View All Examples](https://chengdick.github.io/react-router-v18/)**
```

## 故障排查

### 问题：GitHub Pages 显示 404

**可能原因**：
- GitHub Pages 未启用
- 分支设置错误
- 部署失败

**解决方法**：
1. 检查 GitHub 仓库的 Pages 设置
2. 查看 Travis CI 构建日志
3. 确保 `gh-pages` 分支存在

### 问题：Travis CI 部署失败

**可能原因**：
- GitHub token 无效或过期
- 权限不足
- 构建脚本错误

**解决方法**：
1. 检查 Travis CI 日志
2. 验证 GitHub token 是否有效
3. 确保 token 有 `repo` 权限

### 问题：示例无法加载

**可能原因**：
- 构建产物缺失
- 路径配置错误
- 资源文件未正确复制

**解决方法**：
1. 检查 `examples/__build__` 目录
2. 验证 webpack 配置
3. 查看浏览器控制台错误

## 本地测试

在部署前，可以本地测试构建：

```bash
# 构建示例
npm run build-examples

# 启动本地服务器测试
cd examples
python -m http.server 8000
# 或使用 Node.js
npx http-server -p 8000

# 访问 http://localhost:8000 查看示例
```

## 更新示例

更新示例后：

1. 提交更改到 `master` 分支
2. Travis CI 会自动重新构建和部署
3. 等待几分钟后刷新 GitHub Pages

## 安全建议

1. **不要提交 GitHub token 到代码库**
2. **使用环境变量存储敏感信息**
3. **定期轮换 GitHub token**
4. **使用最小权限原则**（只授予必要的权限）

## 相关链接

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Travis CI 文档](https://docs.travis-ci.com/)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## 注意事项

⚠️ **重要**：
- GitHub Pages 部署可能需要几分钟时间
- 首次部署后，链接才会生效
- 如果更改了仓库名称，记得更新 `homepage` 字段

