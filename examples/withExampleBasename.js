import useBasename from 'history/lib/useBasename'

// This helper is for setting basename on examples with minimal boilerplate. In
// an actual application, you would build a custom history to set basename.
export default function withExampleBasename(history, dirname) {
  // 获取 GitHub Pages 基础路径（在构建时通过 webpack DefinePlugin 注入）
  // __GITHUB_PAGES_BASE_PATH__ 会在构建时被替换为实际的基础路径字符串
  // eslint-disable-next-line no-undef
  const basePath = typeof __GITHUB_PAGES_BASE_PATH__ !== 'undefined' ? __GITHUB_PAGES_BASE_PATH__ : ''
  
  // 构建完整的 basename
  // 如果有基础路径（如 /react-router-v18），则使用 basePath + /dirname
  // 否则只使用 /dirname（本地开发时）
  const basename = basePath && basePath !== '/'
    ? `${basePath}/${dirname}`
    : `/${dirname}`
  
  return useBasename(() => history)({ basename })
}
