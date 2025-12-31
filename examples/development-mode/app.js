/*
 * React 18 开发模式示例
 * 
 * 这个示例展示了在 React 18 开发模式下如何使用 React Router，
 * 包括 StrictMode、开发工具、调试信息和 React 18 新特性。
 */

import React, { Component, StrictMode, useState, useEffect } from 'react'
import { render } from '../renderHelper'
import { browserHistory, Router, Route, Link, IndexRoute } from 'react-router'
import withExampleBasename from '../withExampleBasename'

import './app.css'

// 开发模式检测
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

// React 18 开发模式信息
const React18DevInfo = () => {
  const [ mountCount, setMountCount ] = useState(0)
  
  useEffect(() => {
    // React 18 StrictMode 在开发模式下会双重挂载组件
    // 这有助于发现副作用问题
    setMountCount(prev => prev + 1)
    // eslint-disable-next-line no-console
    console.log('组件挂载/重新挂载次数:', mountCount + 1)
    
    return () => {
      // eslint-disable-next-line no-console
      console.log('组件卸载')
    }
  }, [])
  
  return (
    <div className="react18-info">
      <h3>⚛️ React 18 开发模式特性</h3>
      <ul>
        <li>
          <strong>StrictMode:</strong> 已启用，组件会双重挂载以检测副作用
          <br />
          <small>当前组件挂载次数: {mountCount} (开发模式下会看到 2 次)</small>
        </li>
        <li>
          <strong>createRoot API:</strong> 使用 React 18 的新渲染 API
        </li>
        <li>
          <strong>自动批处理:</strong> React 18 会自动批处理状态更新
        </li>
        <li>
          <strong>并发特性:</strong> 支持并发渲染和 Suspense
        </li>
      </ul>
      {isDevelopment && (
        <div className="dev-warning">
          <strong>⚠️ 开发模式提示:</strong>
          <p>在开发模式下，StrictMode 会故意双重挂载组件来帮助你发现副作用问题。这是正常的开发行为，生产环境不会发生。</p>
        </div>
      )}
    </div>
  )
}

// 开发工具组件 - 显示路由信息和 React 18 特性
class DevTools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTools: isDevelopment,
      batchCount: 0
    }
  }

  toggleTools = () => {
    this.setState({ showTools: !this.state.showTools })
  }

  // 演示 React 18 的自动批处理
  testBatching = () => {
    // React 18 会自动批处理这些状态更新
    this.setState({ batchCount: this.state.batchCount + 1 })
    this.setState({ batchCount: this.state.batchCount + 1 })
    this.setState({ batchCount: this.state.batchCount + 1 })
    // 在 React 18 中，这只会触发一次重新渲染
    // eslint-disable-next-line no-console
    console.log('测试自动批处理 - 应该只看到一次重新渲染')
  }

  render() {
    if (!isDevelopment) return null

    const { location, params, routes } = this.props

    return (
      <div className="dev-tools">
        <button onClick={this.toggleTools} className="dev-tools-toggle">
          {this.state.showTools ? '隐藏' : '显示'} 开发工具
        </button>
        {this.state.showTools && (
          <div className="dev-tools-panel">
            <h3>🔧 React 18 开发工具</h3>
            <div className="dev-info">
              <div className="dev-info-item">
                <strong>React 版本:</strong>
                <code>{React.version}</code>
              </div>
              <div className="dev-info-item">
                <strong>当前路径:</strong>
                <code>{location.pathname}</code>
              </div>
              <div className="dev-info-item">
                <strong>查询参数:</strong>
                <code>{JSON.stringify(location.query || {})}</code>
              </div>
              <div className="dev-info-item">
                <strong>路由参数:</strong>
                <code>{JSON.stringify(params || {})}</code>
              </div>
              <div className="dev-info-item">
                <strong>路由层级:</strong>
                <ul>
                  {routes && routes.map((route, index) => (
                    <li key={index}>
                      {route.path || '/'} {route.component && `(${route.component.name || 'Component'})`}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="dev-info-item">
                <strong>环境:</strong>
                <code>{process.env.NODE_ENV || 'development'}</code>
              </div>
              <div className="dev-info-item">
                <strong>StrictMode:</strong>
                <code>已启用</code>
                <small>（开发模式下会双重挂载组件）</small>
              </div>
              <div className="dev-info-item">
                <strong>自动批处理测试:</strong>
                <button onClick={this.testBatching} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                  测试批处理
                </button>
                <small>计数: {this.state.batchCount}</small>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

// 主应用组件
const App = ({ children, location, params, routes }) => (
  <div className="app">
    <h1>开发模式示例</h1>
    <nav>
      <ul>
        <li><Link to="/" activeClassName="active">首页</Link></li>
        <li><Link to="/dashboard" activeClassName="active">仪表盘</Link></li>
        <li><Link to="/users" activeClassName="active">用户列表</Link></li>
        <li><Link to="/settings" activeClassName="active">设置</Link></li>
        <li><Link to="/debug" activeClassName="active">调试页面</Link></li>
      </ul>
    </nav>
    <main>
      {children}
    </main>
    <DevTools location={location} params={params} routes={routes} />
  </div>
)

// 首页
const Index = () => (
  <div className="page">
    <h2>欢迎使用 React 18 开发模式示例</h2>
    <p>这个示例展示了在 React 18 开发模式下使用 React Router 的最佳实践。</p>
    
    <React18DevInfo />
    
    <div className="features">
      <h3>特性：</h3>
      <ul>
        <li>✅ <strong>React 18 StrictMode</strong> - 启用开发模式检查</li>
        <li>✅ <strong>createRoot API</strong> - 使用 React 18 的新渲染 API</li>
        <li>✅ 开发工具面板 - 显示当前路由信息</li>
        <li>✅ 路由参数和查询参数调试</li>
        <li>✅ 环境检测和开发模式标识</li>
        <li>✅ 活跃链接高亮</li>
        <li>✅ 嵌套路由示例</li>
        <li>✅ 自动批处理演示</li>
      </ul>
    </div>
    {isDevelopment && (
      <div className="dev-notice">
        <strong>🔨 React 18 开发模式已启用</strong>
        <p>你可以看到开发工具面板，显示当前的路由状态信息。</p>
        <p>打开浏览器控制台，查看 StrictMode 的双重挂载日志。</p>
      </div>
    )}
  </div>
)

// 仪表盘
const Dashboard = () => (
  <div className="page">
    <h2>仪表盘</h2>
    <p>这是仪表盘页面，展示了如何在开发模式下组织路由。</p>
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>总访问量</h3>
        <p className="stat-value">1,234</p>
      </div>
      <div className="stat-card">
        <h3>活跃用户</h3>
        <p className="stat-value">567</p>
      </div>
      <div className="stat-card">
        <h3>今日新增</h3>
        <p className="stat-value">89</p>
      </div>
    </div>
  </div>
)

// 用户列表
const Users = ({ children }) => (
  <div className="page">
    <h2>用户管理</h2>
    <nav className="sub-nav">
      <Link to="/users" activeClassName="active">所有用户</Link>
      <Link to="/users/new" activeClassName="active">新建用户</Link>
    </nav>
    {children || (
      <div>
        <p>用户列表页面</p>
        <ul>
          <li><Link to="/users/1">用户 1</Link></li>
          <li><Link to="/users/2">用户 2</Link></li>
          <li><Link to="/users/3">用户 3</Link></li>
        </ul>
      </div>
    )}
  </div>
)

// 用户详情
const UserDetail = ({ params: routeParams }) => (
  <div className="page">
    <h2>用户详情</h2>
    <p>用户 ID: <strong>{routeParams.id}</strong></p>
    {isDevelopment && (
      <div className="dev-info">
        <p><strong>开发提示:</strong> 这个页面展示了如何获取路由参数。</p>
        <code>params.id = {routeParams.id}</code>
      </div>
    )}
    <Link to="/users">← 返回用户列表</Link>
  </div>
)

// 新建用户
const NewUser = () => (
  <div className="page">
    <h2>新建用户</h2>
    <form>
      <div>
        <label>用户名:</label>
        <input type="text" placeholder="输入用户名" />
      </div>
      <div>
        <label>邮箱:</label>
        <input type="email" placeholder="输入邮箱" />
      </div>
      <button type="submit">创建用户</button>
    </form>
  </div>
)

// 设置页面
const Settings = ({ location }) => (
  <div className="page">
    <h2>设置</h2>
    <p>这是设置页面。</p>
    {isDevelopment && location.query && Object.keys(location.query).length > 0 && (
      <div className="dev-info">
        <p><strong>查询参数:</strong></p>
        <pre>{JSON.stringify(location.query, null, 2)}</pre>
        <p>尝试访问: <code>?theme=dark&lang=zh</code></p>
      </div>
    )}
  </div>
)

// 调试页面
const DebugPage = ({ location, params, routes }) => (
  <div className="page">
    <h2>调试页面</h2>
    <p>这个页面专门用于开发调试，显示所有路由相关信息。</p>
    <div className="debug-info">
      <h3>Location 对象:</h3>
      <pre>{JSON.stringify(location, null, 2)}</pre>
      <h3>Params 对象:</h3>
      <pre>{JSON.stringify(params || {}, null, 2)}</pre>
      <h3>Routes 数组:</h3>
      <pre>{JSON.stringify(routes || [], null, 2)}</pre>
    </div>
  </div>
)

// React 18 开发模式渲染
// 使用 StrictMode 包裹应用以启用开发模式检查
const AppWithStrictMode = () => (
  <StrictMode>
    <Router history={withExampleBasename(browserHistory, __dirname)}>
      <Route path="/" component={App}>
        <IndexRoute component={Index} />
        <Route path="dashboard" component={Dashboard} />
        <Route path="users" component={Users}>
          <Route path="new" component={NewUser} />
          <Route path=":id" component={UserDetail} />
        </Route>
        <Route path="settings" component={Settings} />
        <Route path="debug" component={DebugPage} />
      </Route>
    </Router>
  </StrictMode>
)

// 使用 React 18 的 createRoot API 渲染
render(
  <AppWithStrictMode />,
  document.getElementById('example')
)

