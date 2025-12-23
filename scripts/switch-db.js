const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma');
const mode = process.argv[2]; // 'sqlite' or 'postgres'

let content = fs.readFileSync(schemaPath, 'utf8');

if (mode === 'sqlite') {
  console.log('🔄 正在切换至 SQLite 引擎并执行 Json -> String 类型降级...');
  content = content.replace(/provider = "postgresql"/g, 'provider = "sqlite"');
  content = content.replace(/url      = env\("DATABASE_URL"\)/g, 'url      = "file:./nexus_desktop.db"');
  // 核心：将所有 Json 类型降级为 String
  content = content.replace(/Json\?/g, 'String?');
  content = content.replace(/Json/g, 'String');
} else {
  console.log('🔄 正在恢复至 PostgreSQL 引擎并还原 Json 类型...');
  content = content.replace(/provider = "sqlite"/g, 'provider = "postgresql"');
  content = content.replace(/url      = "file:.\/nexus_desktop.db"/g, 'url      = env("DATABASE_URL")');
  // 核心：还原 Json 类型
  // 这里需要小心，如果用户原本就有 String 类型则不能误伤
  // 幸好我们的 Schema 中 Json 都是大写开头且有明显的映射关系
  content = content.replace(/@map\("行业"\)\s+String\?/g, '@map("行业")          Json?');
  content = content.replace(/@map\("飞桨具体模型"\)\s+String\?/g, '@map("飞桨具体模型")     Json?');
  content = content.replace(/@map\("文心应用场景"\)\s+String\?/g, '@map("文心应用场景")     Json?');
  content = content.replace(/@map\("百度AI认证证书"\)\s+String\?/g, '@map("百度AI认证证书")   Json?');
  content = content.replace(/@map\("参与活动记录"\)\s+String\?/g, '@map("参与活动记录")     Json?');
  content = content.replace(/@map\("联合解决方案"\)\s+String\?/g, '@map("联合解决方案")     Json?');
  content = content.replace(/@map\("技术培训记录"\)\s+String\?/g, '@map("技术培训记录")     Json?');
  content = content.replace(/@map\("获奖记录"\)\s+String\?/g, '@map("获奖记录")         Json?');
  content = content.replace(/@map\("证据链数据"\)\s+String\?/g, '@map("证据链数据")       Json?');
  content = content.replace(/oldValue\s+String\?/g, 'oldValue    Json?');
  content = content.replace(/newValue\s+String\?/g, 'newValue    Json?');
  content = content.replace(/resultData\s+String\?/g, 'resultData    Json?');
  content = content.replace(/filters\s+String\?/g, 'filters        Json?');
  content = content.replace(/configuration\s+String\?/g, 'configuration  Json?');
}

fs.writeFileSync(schemaPath, content);
console.log('✅ Prisma Schema 处理完成。');