const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 获取当前日期 YYYYMMDD
const today = new Date();
const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');

// 生成新版本号: 日期.原版本号(移除旧日期前缀)
// 如果原版本已经是日期开头，则只保留后半部分
let baseVersion = pkg.version;
if (baseVersion.includes('.')) {
  const parts = baseVersion.split('.');
  // 如果第一部分是8位数字(日期)，则取后面的部分
  if (/^\d{8}$/.test(parts[0])) {
    baseVersion = parts.slice(1).join('.');
  }
}

const newVersion = `5.0.${datePrefix}`;
pkg.version = newVersion;

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
console.log(`[VERSION] Updated package.json version to: ${newVersion}`);
