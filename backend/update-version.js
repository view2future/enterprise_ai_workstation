const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, 'package.json');
const pkg = require(packagePath);

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');

// Generate version prefix: YYYY.MM.DD
const versionPrefix = `${year}.${month}.${day}`;

// Check if current version matches today's prefix
let buildNumber = 1;
if (pkg.version.startsWith(versionPrefix)) {
  const parts = pkg.version.split('.');
  const lastPart = parts[parts.length - 1];
  buildNumber = parseInt(lastPart, 10) + 1;
}

const newVersion = `${versionPrefix}.${buildNumber}`;

console.log(`🚀 Updating version from ${pkg.version} to ${newVersion}`);

pkg.version = newVersion;

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
console.log('✅ Version updated in package.json');
