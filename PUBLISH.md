# 发布指南

本文档说明如何使用 GitHub Actions 自动发布 `react-router-v18` 到 npm。

## 🚀 快速开始

### 前置条件

1. **npm 账号**：确保你有一个 npm 账号
2. **npm Token**：需要在 GitHub Secrets 中配置 `NPM_TOKEN`

### 配置 npm Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 进入 **Account Settings** → **Access Tokens**
3. 点击 **Generate New Token** → 选择 **Automation** 类型
4. 复制生成的 token
5. 在 GitHub 仓库中：
   - 进入 **Settings** → **Secrets and variables** → **Actions**
   - 点击 **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: 粘贴你的 npm token
   - 点击 **Add secret**

## 📦 发布方式

### 方式一：通过 Git Tag 自动发布（推荐）

1. **更新版本号并创建标签**：
   ```bash
   # 更新版本号（会自动更新 package.json 并创建 git commit）
   npm version patch  # 1.0.0 -> 1.0.1
   # 或
   npm version minor  # 1.0.0 -> 1.1.0
   # 或
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **推送代码和标签**：
   ```bash
   git push origin master
   git push --tags
   ```

3. **GitHub Actions 自动执行**：
   - 检测到新的 tag（格式：`v1.0.1`）
   - 运行测试
   - 构建项目
   - 如果测试通过，自动发布到 npm
   - 自动创建 GitHub Release

### 方式二：手动触发发布

**注意**：手动触发会发布当前 `package.json` 中的版本，不会自动更新版本号。

1. **先更新版本号**（如果需要）：
   ```bash
   npm version patch  # 或 minor/major
   git push origin master
   git push --tags
   ```

2. **手动触发发布**：
   - 进入 GitHub 仓库的 **Actions** 标签页
   - 选择 **Publish to npm** 工作流
   - 点击 **Run workflow** 按钮

工作流会自动：
- 检查版本是否已发布（避免重复发布）
- 运行测试
- 构建项目
- 发布到 npm（如果版本未发布）

## 📋 发布检查清单

在发布前，确保：

- [ ] 所有测试通过
- [ ] 代码已 lint 检查
- [ ] 版本号已更新（或准备更新）
- [ ] CHANGES.md 已更新（如果有）
- [ ] README.md 信息正确
- [ ] package.json 信息正确
- [ ] 已提交所有更改
- [ ] npm token 已配置（`NPM_TOKEN` secret）

## 🔢 版本号规则

遵循 [语义化版本](https://semver.org/)：

- **MAJOR**：不兼容的 API 修改（如：1.0.0 -> 2.0.0）
- **MINOR**：向下兼容的功能性新增（如：1.0.0 -> 1.1.0）
- **PATCH**：向下兼容的问题修正（如：1.0.0 -> 1.0.1）

## ✅ 发布后验证

发布成功后：

1. 检查 npm 包页面：`https://www.npmjs.com/package/react-router-v18`
2. 测试安装：
   ```bash
   npm install react-router-v18@latest
   ```
3. 验证功能是否正常
4. 检查 GitHub Release 是否已创建

## 🔧 故障排查

### 问题：发布失败 - npm token 无效

**解决方法**：
1. 检查 GitHub Secrets 中的 `NPM_TOKEN` 是否正确
2. 验证 npm token 是否有效（在 npm 网站检查）
3. 确保 token 有发布权限

### 问题：发布失败 - 版本号已存在

**解决方法**：
1. 检查 npm 上是否已存在该版本
2. 更新版本号后再发布

### 问题：测试失败导致无法发布

**解决方法**：
1. 查看 GitHub Actions 日志
2. 修复测试问题
3. 确保所有测试通过后再发布

### 问题：构建失败

**解决方法**：
1. 本地运行 `yarn build` 检查是否有错误
2. 查看 GitHub Actions 日志
3. 修复构建问题

## 📝 工作流说明

发布工作流（`.github/workflows/publish.yml`）会：

1. ✅ 运行 lint 检查
2. ✅ 运行测试
3. ✅ 构建项目（CJS、ES、UMD）
4. ✅ 发布到 npm
5. ✅ 创建 GitHub Release（如果通过 tag 触发）

## 🔐 安全建议

1. **不要提交 npm token 到代码库**
2. **使用 GitHub Secrets 存储敏感信息**
3. **定期轮换 npm token**
4. **使用最小权限原则**（Automation token）

## ⚠️ 注意事项

- 发布到 npm 后，版本号无法修改
- 如果发布错误，需要发布一个新的版本号
- 确保在发布前测试所有功能
- 建议先在测试环境验证

## 🔗 相关链接

- [npm 文档](https://docs.npmjs.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [语义化版本](https://semver.org/)

