import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(userId: number, targetType: string, targetId: number, content: string, mentionedIds?: number[]) {
    const comment = await this.prisma.comment.create({
      data: {
        content,
        targetType,
        targetId,
        authorId: userId,
        mentionedIds: mentionedIds ? JSON.stringify(mentionedIds) : null,
      },
      include: {
        author: {
          select: { username: true }
        }
      }
    });

    if (mentionedIds && mentionedIds.length > 0) {
      const mentions = typeof mentionedIds === 'string' ? JSON.parse(mentionedIds) : mentionedIds;
      for (const mentionedId of mentions) {
        await this.notificationsService.create(
          mentionedId,
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
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
