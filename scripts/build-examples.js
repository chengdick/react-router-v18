/* eslint-disable no-console */
const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')

function exec(command) {
  console.log(`执行: ${command}`)
  execSync(command, { stdio: [0, 1, 2] })
}

// 构建 UMD 版本用于示例
console.log('构建 UMD 版本...')
exec('npm run build-umd')
exec('npm run build-min')

// 构建示例
console.log('构建示例...')
process.env.NODE_ENV = 'production'
exec('webpack --config examples/webpack.config.js --mode production')

// 复制 UMD 文件到 examples/__build__ 目录
const buildDir = path.join(__dirname, '..', 'examples', '__build__')
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true })
}

const umdFiles = ['ReactRouter.js', 'ReactRouter.min.js']
umdFiles.forEach(file => {
  const src = path.join(__dirname, '..', 'umd', file)
  const dest = path.join(buildDir, file)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(`复制 ${file} 到 examples/__build__`)
  }
})

console.log('示例构建完成！')

