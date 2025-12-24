
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 省份与省会映射表
const provinceToCapital: Record<string, string> = {
  '四川': '成都',
  '陕西': '西安',
  '广东': '广州',
  '浙江': '杭州',
  '江苏': '南京',
  '湖北': '武汉',
  '湖南': '长沙',
  '福建': '福州',
  '山东': '济南',
  '河南': '郑州',
  '河北': '石家庄',
  '山西': '太原',
  '辽宁': '沈阳',
  '吉林': '长春',
  '黑龙江': '哈尔滨',
  '安徽': '合肥',
  '江西': '南昌',
  '云南': '昆明',
  '贵州': '贵阳',
  '甘肃': '兰州',
  '青海': '西宁',
  '海南': '海口',
  '台湾': '台北'
};

// 常见城市列表用于匹配
const commonCities = [
  '成都', '西安', '上海', '深圳', '北京', '广州', '杭州', '南京', '武汉', '重庆', 
  '天津', '苏州', '厦门', '珠海', '东莞', '佛山', '大连', '青岛', '宁波', '无锡',
  '绵阳', '德阳', '宜宾', '眉山'
];

async function main() {
  console.log('🌐 正在启动企业所属地逻辑重构程序...');

  const enterprises = await prisma.enterprise.findMany();
  let updatedCount = 0;

  for (const ent of enterprises) {
    let newBase = '成都'; // 默认归属成都
    const name = ent.enterpriseName;

    // 1. 尝试匹配城市
    for (const city of commonCities) {
      if (name.includes(city)) {
        newBase = city;
        break;
      }
    }

    // 2. 如果没匹配到城市，尝试匹配省份并转省会
    if (newBase === '成都' && !name.includes('成都')) {
      for (const province in provinceToCapital) {
        if (name.includes(province)) {
          newBase = provinceToCapital[province];
          break;
        }
      }
    }

    // 3. 执行更新
    if (newBase !== ent.base) {
      await prisma.enterprise.update({
        where: { id: ent.id },
        data: { base: newBase }
      });
      updatedCount++;
    }
  }

  console.log(`✅ 地理归属重构完成。共处理 ${enterprises.length} 家企业，修正了 ${updatedCount} 个地理偏差节点。`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
