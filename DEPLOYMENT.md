# 发布部署指南

本文档说明如何通过 Travis CI 自动发布 `react-router-v18` 到 npm。

## 前置条件

1. **npm 账号**：确保你有一个 npm 账号
2. **Travis CI 账号**：确保项目已连接到 Travis CI
3. **npm Token**：需要生成 npm 访问令牌

## 设置步骤

### 1. 生成 npm Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 进入 **Account Settings** → **Access Tokens**
3. 点击 **Generate New Token**
4. 选择 **Automation** 类型（用于 CI/CD）
5. 复制生成的 token（只显示一次，请妥善保存）

### 2. 加密 npm Token

在 Travis CI 中加密你的 npm token：

```bash
# 安装 Travis CI CLI（如果还没有）
gem install travis

# 登录 Travis CI
travis login

# 在项目根目录下加密 npm token
travis encrypt NPM_TOKEN=your_npm_token_here --add deploy.api_key
```

或者手动在 Travis CI 网站设置：
1. 进入项目设置页面
2. 在 **Environment Variables** 中添加：
   - Name: `NPM_TOKEN`
   - Value: 你的 npm token
   - 勾选 **Display value in build log**（可选，用于调试）

### 3. 更新 .travis.yml

确保 `.travis.yml` 中的配置正确：

```yaml
deploy:
  provider: npm
  email: your-email@example.com  # 替换为你的 npm 邮箱
  api_key: $NPM_TOKEN  # 使用环境变量
  on:
    tags: true
    branch: master
    condition: "$TRAVIS_TAG =~ ^v[0-9]"
  skip_cleanup: true
```

### 4. 更新 package.json

确保 `package.json` 中的信息正确：

```json
{
  "name": "react-router-v18",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/chengdick/react-router-v18.git"
  }
}
```

## 发布流程

### 方式一：通过 Git Tag 自动发布（推荐）

1. **更新版本号**：
   ```bash
   # 使用 npm version 命令自动更新版本并创建 tag
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

3. **Travis CI 自动执行**：
   - 检测到新的 tag（格式：`v1.0.1`）
   - 运行测试
   - 如果测试通过，自动发布到 npm

### 方式二：手动发布

如果需要手动发布（不通过 CI）：

```bash
# 1. 构建项目
npm run build

# 2. 运行测试确保一切正常
npm test

# 3. 发布到 npm
npm publish
```

## 发布检查清单

在发布前，确保：

- [ ] 所有测试通过
- [ ] 代码已 lint 检查
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新（如果有）
- [ ] README.md 信息正确
- [ ] package.json 信息正确
- [ ] 已提交所有更改
- [ ] npm token 已配置

## 版本号规则

遵循 [语义化版本](https://semver.org/)：

- **MAJOR**：不兼容的 API 修改
- **MINOR**：向下兼容的功能性新增
- **PATCH**：向下兼容的问题修正

## 发布后验证

发布成功后：

1. 检查 npm 包页面：`https://www.npmjs.com/package/react-router-v18`
2. 测试安装：
   ```bash
   npm install react-router-v18@latest
   ```
3. 验证功能是否正常

## 故障排查

### 问题：Travis CI 发布失败

**可能原因**：
- npm token 无效或过期
- 版本号已存在
- package.json 配置错误

**解决方法**：
1. 检查 Travis CI 日志
2. 验证 npm token 是否有效
3. 确保版本号唯一

### 问题：发布到错误的包名

**解决方法**：
- 检查 `package.json` 中的 `name` 字段
- 确保你有该包名的发布权限

### 问题：测试失败导致无法发布

**解决方法**：
- 修复测试问题
- 确保所有测试通过后再发布

## 安全建议

1. **不要提交 npm token 到代码库**
2. **使用环境变量存储敏感信息**
3. **定期轮换 npm token**
4. **使用最小权限原则**（Automation token）

## 相关链接

- [npm 文档](https://docs.npmjs.com/)
- [Travis CI 文档](https://docs.travis-ci.com/)
- [语义化版本](https://semver.org/)

## 注意事项

⚠️ **重要**：发布到 npm 后，版本号无法修改。如果发布错误，需要发布一个新的版本号。

