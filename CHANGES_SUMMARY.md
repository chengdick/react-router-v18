# React Router 升级到 React 18/19 - 快速参考

## 核心改动摘要

### 1. 新增文件
- `modules/RouterContextProvider.js` - 新的 Context Provider（使用 `React.createContext()`）
- `modules/__tests__/testHelpers.js` - React 18 测试辅助函数
- `examples/renderHelper.js` - React 18 示例渲染辅助函数
- `UPGRADE_TO_REACT_18.md` - 详细升级文档

### 2. 核心模块修改
- `modules/RouterContext.js` - 移除旧 Context API，使用新 Provider
- `modules/Link.js` - 移除旧 Context API，使用新 Consumer
- `modules/withRouter.js` - 移除旧 Context API，使用新 Consumer
- `modules/Router.js` - 生命周期方法迁移
- `modules/ContextUtils.js` - 生命周期方法迁移（保留旧 Context API 用于内部订阅）

### 3. 示例文件修改
- 所有示例文件 - 更新渲染函数、生命周期方法、字符串 ref
- 动画示例 - 更新到 `react-transition-group` v4+ API

### 4. 配置修改
- `package.json` - 更新 `peerDependencies`、仓库地址、依赖位置

## 关键 API 变更

### Context API
```javascript
// 旧：childContextTypes / contextTypes
// 新：React.createContext() + Provider/Consumer
```

### 渲染 API
```javascript
// 旧：ReactDOM.render()
// 新：createRoot() from 'react-dom/client'
```

### 生命周期
```javascript
// 旧：componentWillMount, componentWillReceiveProps
// 新：getInitialState/componentDidMount, componentDidUpdate
```

### Ref API
```javascript
// 旧：ref="name", this.refs.name
// 新：ref={(el) => { this.nameRef = el }}, this.nameRef
```

## 支持的 React 版本

- React 16.3+ ✅
- React 17 ✅
- React 18 ✅
- React 19 ✅

## 不支持的版本

- React 0.14 ❌
- React 15 ❌
- React 16.0-16.2 ❌

原因：需要 `React.createContext()`（React 16.3+ 引入）

## 详细文档

查看 [UPGRADE_TO_REACT_18.md](./UPGRADE_TO_REACT_18.md) 获取完整的升级文档。

