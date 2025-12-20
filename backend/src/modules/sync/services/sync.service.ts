import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * 导出增量或全量企业数据
   * @param since 上次同步时间
   */
  async exportData(since?: string) {
    const whereClause: any = { status: 'active' };
    if (since) {
      whereClause.updatedAt = {
        gt: new Date(since),
      };
    }

    const enterprises = await this.prisma.enterprise.findMany({
      where: whereClause,
    });

    return {
      metadata: {
        version: '1.0',
        exportTimestamp: new Date().toISOString(),
        recordCount: enterprises.length,
      },
      payload: enterprises,
    };
  }

  /**
   * 导入并合并数据
   * @param payload 导出的企业数据列表
   */
  async importData(payload: any[]) {
    const results = {
      updated: 0,
      created: 0,
      skipped: 0,
      conflicts: [],
    };

    // 使用事务确保原子性
    await this.prisma.$transaction(async (tx) => {
      for (const item of payload) {
        // 1. 尝试通过统一社会信用代码匹配
        let existing = null;
        if (item.unifiedSocialCreditCode) {
          existing = await tx.enterprise.findFirst({
            where: { unifiedSocialCreditCode: item.unifiedSocialCreditCode },
          });
        }

        // 2. 如果没匹配到，通过名称匹配
        if (!existing) {
          existing = await tx.enterprise.findUnique({
            where: { enterpriseName: item.enterpriseName },
          });
        }

        if (existing) {
          // 检查本地版本是否更新
          const localUpdated = new Date(existing.updatedAt).getTime();
          const remoteUpdated = new Date(item.updatedAt).getTime();

          if (remoteUpdated > localUpdated) {
            // 远程版本更新，执行更新
            const { id, createdAt, ...updateData } = item;
            await tx.enterprise.update({
              where: { id: existing.id },
              data: {
                ...updateData,
                updatedAt: new Date(item.updatedAt), // 保持远程的时间戳
              },
            });
            results.updated++;
          } else {
            results.skipped++;
          }
        } else {
          // 不存在，创建新记录
          const { id, ...createData } = item;
          await tx.enterprise.create({
            data: {
              ...createData,
              status: 'active',
            },
          });
          results.created++;
        }
      }
    });

    return results;
  }
}
