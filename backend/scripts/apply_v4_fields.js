
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../prisma/nexus_desktop.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('--- 手动同步 V4.0 核心字段 ---');

  // 1. 添加缺失字段
  const columnsToAdd = [
    { name: 'certStatus', type: 'TEXT DEFAULT "PENDING"' },
    { name: 'shippingStatus', type: 'TEXT DEFAULT "NOT_SHIPPED"' },
    { name: 'trackingNumber', type: 'TEXT' }
  ];

  columnsToAdd.forEach(col => {
    db.run(`ALTER TABLE enterprises ADD COLUMN ${col.name} ${col.type}`, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`[INFO] 字段 ${col.name} 已存在，跳过。`);
        } else {
          console.error(`[ERROR] 无法添加字段 ${col.name}:`, err.message);
        }
      } else {
        console.log(`[SUCCESS] 字段 ${col.name} 已注入。`);
      }
    });
  });

  console.log('--- 正在完成同步 ---');
});

db.close();
