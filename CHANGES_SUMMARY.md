# React Router 升级到 React 18/19 - 快速参考

## 核心改动摘要

### 1. 新增文件
- `modules/RouterContextProvider.js` - 新的 Context Provider（使用 `React.createContext()`）
- `modules/__tests__/testHelpers.js` - React 18 测试辅助函数
- `examples/renderHelper.js` - React 18 示例渲染辅助函数
- `UPGRADE_TO_REACT_18.md` - 详细升级文档

### 2. 核心模块修改
- `modules/RouterContext.js` - 移除旧 Context API，使用新 Provider，迁移到 ES6 类组件
- `modules/Link.js` - 移除旧 Context API，使用新 Consumer，迁移到 ES6 类组件
- `modules/withRouter.js` - 移除旧 Context API，使用新 Consumer，迁移到 ES6 类组件，移除 `hoist-non-react-statics` 依赖
- `modules/Router.js` - 生命周期方法迁移，迁移到 ES6 类组件
- `modules/Route.js` - 迁移到 ES6 类组件
- `modules/Redirect.js` - 迁移到 ES6 类组件
- `modules/IndexRoute.js` - 迁移到 ES6 类组件
- `modules/IndexRedirect.js` - 迁移到 ES6 类组件
- `modules/IndexLink.js` - 迁移到 ES6 类组件
- `modules/ContextUtils.js` - 生命周期方法迁移（保留旧 Context API 用于内部订阅）

### 3. 示例文件修改
- 所有示例文件 - 更新渲染函数、生命周期方法、字符串 ref
- 所有示例文件 - 从 `create-react-class` 迁移到 ES6 类组件（15 个文件）
- 动画示例 - 更新到 `react-transition-group` v4+ API

### 4. 配置修改
- `package.json` - 更新 `peerDependencies`、仓库地址、依赖位置
- `package.json` - 移除 `create-react-class` 依赖
- `package.json` - 移除 `hoist-non-react-statics` 依赖

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

### 组件定义
```javascript
// 旧：createReactClass({ getInitialState() {...}, render() {...} })
// 新：class Component extends React.Component { constructor(props) { this.state = {...} }, render() {...} }
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

## 免责声明

**⚠️ Disclaimer / 免责声明**

This is a community-maintained fork of React Router 3.2.4. The original authors and maintainers of React Router are not responsible for this fork or any issues that may arise from using it.

**Use at your own risk.** The maintainers of this fork are not liable for any damages, data loss, or issues that may occur from using this software.

If you use this code, you acknowledge that:
- This is a modified version of the original React Router
- The original authors are not associated with this fork
- You are using this software at your own risk
- The maintainers of this fork are not responsible for any consequences

---

这是一个社区维护的 React Router 3.2.4 分支版本。React Router 的原始作者和维护者不对此分支或使用它可能出现的任何问题负责。

**使用风险自负。** 此分支的维护者不对使用本软件可能造成的任何损害、数据丢失或问题承担责任。

如果您使用此代码，即表示您承认：
- 这是原始 React Router 的修改版本
- 原始作者与此分支无关
- 您使用本软件的风险由您自行承担
- 此分支的维护者不对任何后果负责

