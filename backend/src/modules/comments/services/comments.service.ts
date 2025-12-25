import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(userId: number, targetType: string, targetId: number, content: string, mentionedIds?: any) {
    const mentionedIdsStr = Array.isArray(mentionedIds) ? JSON.stringify(mentionedIds) : mentionedIds;
    
    const comment = await this.prisma.comment.create({
      data: {
        content,
        targetType,
        targetId,
        authorId: userId,
        mentionedIds: mentionedIdsStr,
      },
      include: {
        author: { select: { id: true, username: true, firstName: true } }
      }
    });

    if (mentionedIds) {
      let ids: number[] = [];
      try {
        ids = Array.isArray(mentionedIds) ? mentionedIds : JSON.parse(mentionedIds);
      } catch (e) {}

      for (const mId of ids) {
        await this.notificationsService.create(
          mId,
          'MENTION',
          '您被 @ 了',
          `${comment.author.username} 在评论中提到了您`,
          `/dashboard/${targetType.toLowerCase()}/${targetId}`
        );
      }
    }

    return comment;
  }

  async getComments(targetType: string, targetId: number) {
    return this.prisma.comment.findMany({
      where: {
        targetType,
        targetId,
      },
      include: {
        author: { select: { id: true, username: true, firstName: true } }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
