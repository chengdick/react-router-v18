/* eslint-disable no-console */
const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')

function exec(command) {
  console.log(`执行: ${command}`)
  execSync(command, { stdio: [ 0, 1, 2 ] })
}

// 构建 UMD 版本用于示例
console.log('构建 UMD 版本...')
exec('yarn build-umd')
exec('yarn build-min')

// 构建示例
console.log('构建示例...')
process.env.NODE_ENV = 'production'

// 设置 GitHub Pages 基础路径（用于 webpack publicPath）
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
const homepage = packageJson.homepage || ''
let basePath = ''
if (homepage) {
  try {
    const url = new URL(homepage)
    basePath = url.pathname
    if (basePath && basePath !== '/') {
      basePath = basePath.replace(/\/$/, '')
    }
  } catch (e) {
    basePath = homepage.replace(/^https?:\/\/[^/]+/, '')
  }
}
if (basePath && basePath !== '/') {
  process.env.GITHUB_PAGES_BASE_PATH = basePath
  console.log(`设置 webpack publicPath 基础路径: ${basePath}`)
}

// webpack 1.x 不支持 --mode 参数，使用 NODE_ENV 环境变量
exec('webpack --config examples/webpack.config.js -p')

// 复制 UMD 文件到 examples/__build__ 目录
const buildDir = path.join(__dirname, '..', 'examples', '__build__')
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true })
}

const umdFiles = [ 'ReactRouter.js', 'ReactRouter.min.js' ]
umdFiles.forEach(file => {
  const src = path.join(__dirname, '..', 'umd', file)
  const dest = path.join(buildDir, file)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(`复制 ${file} 到 examples/__build__`)
  }
})

// 修复 GitHub Pages 路径问题
console.log('修复 GitHub Pages 路径...')

// 使用之前提取的 basePath
if (basePath && basePath !== '/') {
  console.log(`使用基础路径: ${basePath}`)
  
  // 修复所有 HTML 文件中的绝对路径
  const examplesDir = path.join(__dirname, '..', 'examples')
  const htmlFiles = []
  
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        findHtmlFiles(filePath)
      } else if (file === 'index.html') {
        htmlFiles.push(filePath)
      }
    })
  }
  
  findHtmlFiles(examplesDir)
  
  htmlFiles.forEach(htmlFile => {
    let content = fs.readFileSync(htmlFile, 'utf8')
    const originalContent = content
    
    // 替换绝对路径为带基础路径的路径
    // /global.css -> /react-router-v18/global.css
    // /__build__/ -> /react-router-v18/__build__/
    // href="/" -> href="/react-router-v18/"
    content = content.replace(/href="\/([^"]*)"/g, (match, p1) => {
      if (p1 === '') {
        return `href="${basePath}/"`
      }
      return `href="${basePath}/${p1}"`
    })
    
    content = content.replace(/src="\/([^"]*)"/g, (match, p1) => {
      return `src="${basePath}/${p1}"`
    })
    
    if (content !== originalContent) {
      fs.writeFileSync(htmlFile, content, 'utf8')
      console.log(`已修复: ${path.relative(examplesDir, htmlFile)}`)
    }
  })
} else {
  console.log('未配置 homepage 或使用根路径，跳过路径修复')
}

console.log('示例构建完成！')

