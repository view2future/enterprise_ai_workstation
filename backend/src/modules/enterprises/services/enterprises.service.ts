import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, EnterpriseFilterDto } from '../dto/enterprise.dto';

@Injectable()
export class EnterprisesService {
  private readonly logger = new Logger(EnterprisesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(filters: EnterpriseFilterDto = {}, userEnvScope: string) {
    const { search, base, priority, feijiangWenxin, page = 0, limit = 50 } = filters;
    
    const whereClause: any = { 
      status: 'active', 
      envScope: userEnvScope 
    };

    if (search) whereClause.enterpriseName = { contains: search, mode: 'insensitive' };
    if (base) whereClause.base = base;
    if (priority) whereClause.priority = priority;
    if (feijiangWenxin) whereClause.feijiangWenxin = feijiangWenxin;

    const total = await this.prisma.enterprise.count({ where: whereClause });
    const items = await this.prisma.enterprise.findMany({
      where: whereClause,
      skip: page * limit,
      take: limit,
      orderBy: { updatedAt: 'desc' }
    });

    const jsonFields = ['industry', 'paddleModels', 'ernieAppScenarios', 'baiduCertificates', 'eventParticipation', 'jointSolutions', 'trainingRecord', 'awardsReceived', 'evidenceChain'];
    const parsedItems = items.map(item => {
      jsonFields.forEach(field => {
        if (typeof item[field] === 'string') {
          try { item[field] = JSON.parse(item[field]); } catch (e) {}
        }
      });
      return item;
    });

    return { items: parsedItems, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number, userEnvScope: string) {
    const ent = await this.prisma.enterprise.findFirst({
      where: { id, status: 'active', envScope: userEnvScope }
    });
    if (!ent) throw new NotFoundException(`资产 #${id} 在 ${userEnvScope} 环境中不存在`);
    
    // 适配 SQLite: 将字符串化的 JSON 字段解析回对象
    const jsonFields = ['industry', 'paddleModels', 'ernieAppScenarios', 'baiduCertificates', 'eventParticipation', 'jointSolutions', 'trainingRecord', 'awardsReceived', 'evidenceChain'];
    jsonFields.forEach(field => {
      if (typeof ent[field] === 'string') {
        try { ent[field] = JSON.parse(ent[field]); } catch (e) {}
      }
    });

    return ent;
  }

  async create(dto: CreateEnterpriseDto, userEnvScope: string) {
    return this.prisma.enterprise.create({
      data: {
        enterpriseName: dto.企业名称,
        envScope: userEnvScope,
        base: dto.base || '成都',
        priority: dto.优先级 || 'P2',
        feijiangWenxin: dto.飞桨_文心,
        taskDirection: dto.任务方向,
        contactInfo: dto.联系人信息,
        status: 'active',
        dataSourceType: 'quick_entry'
      }
    });
  }

  /**
   * 智研解析引擎：从非结构化文本提取字段 (NLP Extraction)
   */
  async parseUnstructured(text: string) {
    const result = {
      enterpriseName: '',
      feijiangWenxin: '',
      taskDirection: '',
      contactInfo: '',
      priority: 'P2'
    };

    // 1. 提取企业名称
    const nameMatch = text.match(/([^\s,，。:：]+(?:科技|智能|有限公司|有限责任公司|研发中心))/);
    if (nameMatch) result.enterpriseName = nameMatch[1];

    // 2. 识别技术栈
    if (text.includes('飞桨') || text.includes('Paddle')) result.feijiangWenxin = '飞桨';
    if (text.includes('文心') || text.includes('ERNIE')) result.feijiangWenxin = '文心';

    // 3. 识别优先级
    if (text.includes('核心') || text.includes('重点') || text.includes('P0')) result.priority = 'P0';
    else if (text.includes('重要') || text.includes('跟进') || text.includes('P1')) result.priority = 'P1';

    // 4. 提取联系人 (匹配 11位手机号)
    const phoneMatch = text.match(/(?:联系人|人|经理)?[:：\s]?([^\s,，。]+)?\s?(1[3-9]\d{9})/);
    if (phoneMatch) result.contactInfo = `${phoneMatch[1] || ''} ${phoneMatch[2]}`.trim();

    // 5. 提取业务方向
    const directionMatch = text.match(/(?:做|测试|应用|落地|场景)[:：\s]?([^\s,，。]+)/);
    if (directionMatch) result.taskDirection = directionMatch[1];

    return result;
  }

  async update(id: number, dto: UpdateEnterpriseDto, userEnvScope: string) {
    const ent = await this.findOne(id, userEnvScope);
    return this.prisma.enterprise.update({
      where: { id: ent.id },
      data: { ...dto, updatedAt: new Date() }
    });
  }

  async remove(id: number, userEnvScope: string) {
    const ent = await this.findOne(id, userEnvScope);
    return this.prisma.enterprise.update({
      where: { id: ent.id },
      data: { status: 'deleted' }
    });
  }

  async getStatistics(userEnvScope: string) {
    const where = { status: 'active', envScope: userEnvScope };
    const [total, p0, feijiang, wenxin] = await Promise.all([
      this.prisma.enterprise.count({ where }),
      this.prisma.enterprise.count({ where: { ...where, priority: 'P0' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '飞桨' } }),
      this.prisma.enterprise.count({ where: { ...where, feijiangWenxin: '文心' } }),
    ]);
    return { total, p0, feijiang, wenxin };
  }
}
