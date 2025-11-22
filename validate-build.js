#!/usr/bin/env node

/**
 * Build Validation Script
 * 验证静态导出构建的完整性
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'out');
const REQUIRED_FILES = [
  'index.html',
  'cases/index.html',
  'workshop/index.html',
  '_redirects',
  '_next/static',
];

const REQUIRED_ROUTES = [
  'cases/math-001/index.html',
  'cases/math-002/index.html',
  'cases/physics-001/index.html',
  'cases/chinese-001/index.html',
  'cases/english-001/index.html',
];

console.log('🔍 验证构建输出...\n');

let hasErrors = false;

// 检查输出目录是否存在
if (!fs.existsSync(OUT_DIR)) {
  console.error('❌ 错误: out 目录不存在');
  console.error('   请先运行: npm run build');
  process.exit(1);
}

console.log('✅ out 目录存在\n');

// 检查必需文件
console.log('📁 检查必需文件:');
for (const file of REQUIRED_FILES) {
  const filePath = path.join(OUT_DIR, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`  ✅ ${file}`);
  } else {
    console.error(`  ❌ ${file} - 缺失`);
    hasErrors = true;
  }
}

console.log('\n📄 检查动态路由:');
for (const route of REQUIRED_ROUTES) {
  const filePath = path.join(OUT_DIR, route);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`  ✅ ${route}`);
  } else {
    console.error(`  ❌ ${route} - 缺失`);
    hasErrors = true;
  }
}

// 检查 _redirects 文件内容
console.log('\n🔀 检查重定向配置:');
const redirectsPath = path.join(OUT_DIR, '_redirects');
if (fs.existsSync(redirectsPath)) {
  const content = fs.readFileSync(redirectsPath, 'utf-8');
  if (content.includes('/*    /index.html   200')) {
    console.log('  ✅ _redirects 配置正确');
  } else {
    console.error('  ❌ _redirects 配置不正确');
    hasErrors = true;
  }
} else {
  console.error('  ❌ _redirects 文件缺失');
  hasErrors = true;
}

// 检查静态资源
console.log('\n🎨 检查静态资源:');
const staticDir = path.join(OUT_DIR, '_next', 'static');
if (fs.existsSync(staticDir)) {
  const files = fs.readdirSync(staticDir);
  if (files.length > 0) {
    console.log(`  ✅ 找到 ${files.length} 个静态资源目录`);
  } else {
    console.error('  ❌ 静态资源目录为空');
    hasErrors = true;
  }
} else {
  console.error('  ❌ 静态资源目录不存在');
  hasErrors = true;
}

// 统计文件大小
console.log('\n📊 构建统计:');
function getDirectorySize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

const totalSize = getDirectorySize(OUT_DIR);
const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
console.log(`  📦 总大小: ${sizeMB} MB`);

if (totalSize > 10 * 1024 * 1024) {
  console.warn(`  ⚠️  警告: 构建大小超过 10MB，可能影响加载速度`);
}

// 检查 HTML 文件
console.log('\n📝 检查 HTML 文件:');
const indexPath = path.join(OUT_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf-8');
  
  // 检查关键元素
  const checks = [
    { name: 'DOCTYPE', pattern: /<!DOCTYPE html>/i },
    { name: 'viewport meta', pattern: /<meta name="viewport"/i },
    { name: 'Next.js scripts', pattern: /_next\/static/i },
  ];
  
  for (const check of checks) {
    if (check.pattern.test(content)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.error(`  ❌ ${check.name} - 缺失`);
      hasErrors = true;
    }
  }
}

// 最终结果
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('\n❌ 验证失败: 发现错误');
  console.error('   请检查上述错误并重新构建\n');
  process.exit(1);
} else {
  console.log('\n✅ 验证成功: 构建输出完整');
  console.log('   可以部署到生产环境\n');
  console.log('💡 下一步:');
  console.log('   1. 本地预览: npx serve out');
  console.log('   2. 部署到 Netlify: 拖拽 out 目录到 https://app.netlify.com/drop');
  console.log('   3. 或使用 Git 部署: git push origin main\n');
}
