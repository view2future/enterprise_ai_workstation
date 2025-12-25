import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(private prisma: PrismaService) {}

  async addComment(userId: number, dto: any) {
    const { targetType, targetId, content } = dto;
    
    // 1. 解析提及 (@username)
    const mentionedUsernames = this.extractMentions(content);
    let mentionedIdsStr = null;

    if (mentionedUsernames.length > 0) {
      const users = await this.prisma.user.findMany({
        where: { username: { in: mentionedUsernames } },
        select: { id: true }
      });
      const ids = users.map(u => u.id);
      if (ids.length > 0) {
        mentionedIdsStr = JSON.stringify(ids);
      }
    }

    // 2. 构建数据
    const data: any = {
      content,
      authorId: userId,
      targetType,
      mentionedIds: mentionedIdsStr,
    };

    if (targetType === 'ENTERPRISE') data.enterpriseId = targetId;
    if (targetType === 'POLICY') data.policyId = targetId;

    // 3. 保存
    return this.prisma.comment.create({
      data,
      include: {
        user: { select: { id: true, username: true, firstName: true } }
      }
    });
  }

  async getComments(targetType: string, targetId: number) {
    const where: any = { targetType };
    if (targetType === 'ENTERPRISE') where.enterpriseId = targetId;
    if (targetType === 'POLICY') where.policyId = targetId;

    return this.prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, firstName: true } }
      }
    });
  }

  private extractMentions(text: string): string[] {
    const regex = /@(\w+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return [...new Set(matches)]; // 去重
  }
}
