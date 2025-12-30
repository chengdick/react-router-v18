# GitHub Pages 部署故障排查

## 常见问题及解决方案

### 1. 代码推送后没有自动部署

#### 检查清单

- [ ] **Travis CI 是否已连接项目**
  - 访问 https://travis-ci.com/ 或 https://travis-ci.org/
  - 确认项目已激活
  - 检查最近的构建记录

- [ ] **GitHub Token 是否配置**
  - 进入 Travis CI 项目设置
  - 检查 Environment Variables 中是否有 `GITHUB_TOKEN`
  - 确保 token 有效且有 `repo` 权限

- [ ] **是否推送到 master 分支**
  - 部署仅在 `master` 分支触发
  - 检查当前分支：`git branch`

- [ ] **测试是否通过**
  - 部署只在测试通过后执行
  - 查看 Travis CI 构建日志
  - 确保 `npm run lint` 和 `npm run test-node` 都通过

- [ ] **GitHub Pages 是否启用**
  - 进入 GitHub 仓库设置 → Pages
  - Source 应设置为 `gh-pages` 分支
  - 如果还没有 `gh-pages` 分支，首次部署会自动创建

#### 检查 Travis CI 日志

1. 登录 Travis CI
2. 进入项目页面
3. 查看最新的构建日志
4. 查找以下关键信息：
   - `before_deploy` 阶段是否执行
   - `deploy` 阶段是否执行
   - 是否有错误信息

### 2. 构建失败

#### 问题：webpack 构建错误

**症状**：`before_deploy` 阶段失败

**可能原因**：
- webpack 1.x 不支持 `--mode` 参数
- 依赖缺失
- 构建脚本错误

**解决方案**：
```bash
# 检查 webpack 版本
npm list webpack

# 如果使用 webpack 1.x，构建脚本应使用：
webpack --config examples/webpack.config.js -p
# 而不是：
webpack --config examples/webpack.config.js --mode production
```

#### 问题：找不到构建产物

**症状**：`local_dir: examples` 找不到文件

**解决方案**：
- 检查 `examples/__build__` 目录是否存在
- 确保构建脚本正确执行
- 在 `before_deploy` 中添加调试命令：
  ```yaml
  before_deploy:
    - npm run build-examples
    - ls -la examples/__build__ || echo "构建目录检查"
  ```

### 3. 部署失败

#### 问题：GitHub Token 无效

**症状**：`deploy` 阶段报错 "Authentication failed"

**解决方案**：
1. 重新生成 GitHub Personal Access Token
2. 确保 token 有 `repo` 权限
3. 在 Travis CI 中更新 `GITHUB_TOKEN` 环境变量
4. 确保环境变量名称正确（区分大小写）

#### 问题：权限不足

**症状**：`deploy` 阶段报错 "Permission denied"

**解决方案**：
1. 检查 GitHub token 权限
2. 确保 token 有完整的 `repo` 权限
3. 如果是组织仓库，确保有部署权限

### 4. GitHub Pages 显示 404

#### 问题：页面无法访问

**症状**：访问 `https://username.github.io/repo-name/` 显示 404

**可能原因**：
- GitHub Pages 未启用
- 分支设置错误
- 首次部署还未完成

**解决方案**：
1. 进入 GitHub 仓库设置 → Pages
2. 确认 Source 设置为 `gh-pages` 分支
3. 等待几分钟（首次部署需要时间）
4. 检查 `gh-pages` 分支是否存在：
   ```bash
   git ls-remote --heads origin gh-pages
   ```

### 5. 示例无法加载

#### 问题：资源文件 404

**症状**：示例页面可以打开，但 JavaScript/CSS 文件无法加载

**可能原因**：
- 路径配置错误
- 构建产物未正确生成
- `publicPath` 配置问题

**解决方案**：
1. 检查浏览器控制台错误
2. 验证 `examples/__build__` 目录中的文件
3. 检查 `webpack.config.js` 中的 `publicPath` 配置
4. 对于 GitHub Pages，可能需要使用相对路径

### 6. 手动触发部署

如果自动部署不工作，可以手动触发：

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "Update examples"

# 2. 推送到 master 分支
git push origin master

# 3. 等待 Travis CI 构建完成

# 4. 如果 Travis CI 没有自动部署，可以手动部署：
npm run build-examples
# 然后使用 gh-pages 工具手动部署
npm install -g gh-pages
gh-pages -d examples
```

### 7. 调试步骤

#### 步骤 1：检查 Travis CI 配置

```bash
# 查看 .travis.yml 配置
cat .travis.yml

# 验证语法（如果有 travis CLI）
travis lint .travis.yml
```

#### 步骤 2：本地测试构建

```bash
# 安装依赖（使用 Yarn）
yarn install

# 运行构建脚本
yarn build-examples

# 检查构建产物
ls -la examples/__build__

# 本地测试
cd examples
python -m http.server 8000
# 访问 http://localhost:8000
```

#### 步骤 3：检查 Travis CI 日志

1. 登录 Travis CI
2. 找到最新的构建
3. 展开 `before_deploy` 和 `deploy` 部分
4. 查找错误信息

#### 步骤 4：验证环境变量

在 Travis CI 构建日志中，环境变量不会显示（安全考虑），但可以通过以下方式验证：

```yaml
# 在 .travis.yml 中添加调试（仅用于调试，完成后删除）
before_deploy:
  - echo "检查环境变量..."
  - '[ -z "$GITHUB_TOKEN" ] && echo "GITHUB_TOKEN 未设置" || echo "GITHUB_TOKEN 已设置"'
```

### 8. 常见错误信息

#### "No such file or directory: examples/__build__"
- **原因**：构建脚本未执行或失败
- **解决**：检查 `before_deploy` 阶段的日志

#### "Authentication failed"
- **原因**：GitHub token 无效或过期
- **解决**：重新生成 token 并更新环境变量

#### "Permission denied"
- **原因**：token 权限不足
- **解决**：确保 token 有 `repo` 权限

#### "Branch not found: gh-pages"
- **原因**：首次部署，分支还未创建
- **解决**：等待 Travis CI 自动创建，或手动创建空分支

### 9. 验证部署成功

部署成功后，应该能看到：

1. **GitHub 仓库中有 `gh-pages` 分支**
   ```bash
   git fetch origin
   git branch -r | grep gh-pages
   ```

2. **GitHub Pages 设置显示已部署**
   - 进入仓库设置 → Pages
   - 应该显示 "Your site is published at..."

3. **可以访问示例页面**
   - 访问 `https://username.github.io/repo-name/`
   - 应该能看到示例列表

### 10. 获取帮助

如果以上方法都无法解决问题：

1. 查看 Travis CI 完整构建日志
2. 检查 GitHub Actions（如果使用）
3. 查看 GitHub Pages 部署日志
4. 参考 [GitHub Pages 文档](https://docs.github.com/en/pages)
5. 参考 [Travis CI 文档](https://docs.travis-ci.com/)

## 快速检查命令

```bash
# 检查当前分支
git branch

# 检查远程分支
git branch -r

# 检查 gh-pages 分支是否存在
git ls-remote --heads origin gh-pages

# 本地测试构建
npm run build-examples && ls -la examples/__build__

# 检查 Travis CI 配置语法
travis lint .travis.yml  # 需要安装 travis CLI
```

