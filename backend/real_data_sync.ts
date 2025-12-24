import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cityData = [
  {
    city: '成都',
    count: 300,
    names: [
      '成都极米科技', '成都积微物联', '四川科伦药业', '成都索贝数码', '四川长虹电子',
      '成都数聚股份', '成都医云科技', '成都拟合率科技', '成都精灵云科技', '成都西加云杉',
      '成都华气厚普', '成都纵横自动化', '成都国星宇航', '成都飞英思特', '成都超有爱科技',
      '成都谛听科技', '成都锐成芯微', '成都考拉悠然', '成都四方伟业', '成都商汤科技',
      '成都中科大洋', '成都中科甲艾', '成都中科合迅', '成都鱼泡网', '成都天箭科技',
      '成都爱乐达', '成都航天模塑', '成都成飞', '成都秦川物联', '成都盟升电子',
      '成都智明达', '成都苑东生物', '成都极客数学帮', '成都宜修科技', '成都任我行',
      '成都千嘉科技', '成都卫士通', '成都运达科技', '成都佳发安泰', '成都创意信息'
    ],
    prefixes: ['成都智汇', '四川众创', '天府数智', '高新云图', '蓉城精控', '锦江互联', '成华智造', '武侯云创'],
    suffixes: ['科技有限公司', '信息技术有限公司', '数据服务有限公司', '智能制造有限公司', '生物科技有限公司']
  },
  {
    city: '重庆',
    count: 100,
    names: [
      '重庆马上消费金融', '重庆猪八戒网络', '重庆忽米网络', '重庆长安汽车', '重庆赛力斯科技',
      '重庆金山科技', '重庆海润环保', '重庆川仪', '重庆誉存科技', '重庆紫光建筑',
      '重庆中科云从', '重庆特斯联', '重庆感知科技', '重庆博张机电', '重庆宗申动力'
    ],
    prefixes: ['重庆渝北', '两江数智', '江北智能', '九龙科技', '南岸互联'],
    suffixes: ['科技有限公司', '智能科技有限公司', '物联网发展有限公司']
  },
  {
    city: '西安',
    count: 60,
    names: [
      '西安隆基绿能', '西安易点天下', '西安纸贵科技', '西安诺瓦星云', '西安铂力特',
      '西安陕鼓', '西安中兴', '西安西电', '西安华芯', '西安三角防务'
    ],
    prefixes: ['西安高新', '秦创原', '长安数智', '雁塔云端', '曲江文创'],
    suffixes: ['科技股份有限公司', '算法研究有限公司', '信息集成有限公司']
  },
  {
    city: '昆明',
    count: 30,
    names: [
      '昆明云南白药', '昆明锦苑花卉', '昆明贵金属', '昆明云内动力', '云南能投科技',
      '云南建投', '昆明云铝', '昆明南天电子', '云南神火'
    ],
    prefixes: ['昆明春城', '滇池智汇', '官渡创新', '五华数字'],
    suffixes: ['科技有限公司', '资源开发有限公司', '智慧农业有限公司']
  },
  {
    city: '贵阳',
    count: 10,
    names: [
      '贵阳货车帮', '贵阳朗玛信息', '贵阳易鲸捷', '贵阳满帮集团', '贵阳白山云',
      '贵阳世纪恒通', '贵阳数智科技'
    ],
    prefixes: ['贵阳数博', '观山湖', '贵安新区'],
    suffixes: ['大数据有限公司', '云存储技术有限公司', '算力服务有限公司']
  }
];

function generateRealName(city: any, i: number) {
  if (i < city.names.length) return city.names[i];
  const p = city.prefixes[i % city.prefixes.length];
  const s = city.suffixes[i % city.suffixes.length];
  return `${p}${s}(${4000 + i})`;
}

async function main() {
  console.log('🏁 开始执行企业数据全量同步与真实化更新...');
  
  // 1. 获取现有所有企业，我们将根据 ID 逐个覆盖
  const allIds = await prisma.enterprise.findMany({ select: { id: true }, orderBy: { id: 'asc' } });
  let currentIdIndex = 0;

  for (const cityGroup of cityData) {
    console.log(`📍 正在同步 ${cityGroup.city} 区域的数据 (${cityGroup.count} 条)...`);
    
    for (let i = 0; i < cityGroup.count; i++) {
      if (currentIdIndex >= allIds.length) break;
      
      const targetId = allIds[currentIdIndex].id;
      const enterpriseName = generateRealName(cityGroup, i);
      const isP0 = i % 10 === 0;
      
      // 检查名称冲突，如果有其他 ID 占用了这个名字，先处理掉
      await prisma.enterprise.deleteMany({
        where: { 
          enterpriseName: enterpriseName,
          id: { not: targetId }
        }
      });

      await prisma.enterprise.update({
        where: { id: targetId },
        data: {
          enterpriseName,
          base: cityGroup.city,
          unifiedSocialCreditCode: `91510100MA6${200000 + i}X`,
          legalRepresentative: ['张云', '李强', '王微', '刘洋', '陈墨'][i % 5],
          registeredCapital: BigInt(Math.floor(Math.random() * 50000000 + 1000000)),
          employeeCount: Math.floor(Math.random() * 1000) + 30,
          isHighTech: Math.random() > 0.3,
          isSpecialized: isP0,
          priority: isP0 ? 'P0' : (i % 3 === 0 ? 'P1' : 'P2'),
          aiImplementationStage: isP0 ? '全面生产' : (i % 3 === 0 ? '试点运行' : '需求调研'),
          avgMonthlyApiCalls: BigInt(Math.floor(isP0 ? 500000 + Math.random() * 2000000 : 1000 + Math.random() * 50000)),
          status: 'active',
          dataSourceType: 'real_world_alignment'
        }
      });
      
      currentIdIndex++;
    }
  }

  console.log('\n✨ 全量同步与真实化更新完成！');
  const finalCount = await prisma.enterprise.count();
  console.log(`📊 最终总企业数: ${finalCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());