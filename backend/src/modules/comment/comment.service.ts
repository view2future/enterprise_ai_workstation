import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: number, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        targetType: dto.targetType,
        targetId: dto.targetId,
        authorId: authorId,
        mentionedIds: dto.mentionedIds ? JSON.stringify(dto.mentionedIds) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    // TODO: Trigger @Mention notifications
    if (dto.mentionedIds && dto.mentionedIds.length > 0) {
      this.handleMentions(comment, dto.mentionedIds);
    }

    return comment;
  }

  async findByTarget(targetType: string, targetId: number) {
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
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  }

  private async handleMentions(comment: any, mentionedIds: number[]) {
    // In a real system, this would push to a notification table or websocket
    console.log(`Comment ${comment.id} mentioned users: ${mentionedIds.join(', ')}`);
  }
}
