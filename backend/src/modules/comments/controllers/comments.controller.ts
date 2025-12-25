import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/comments.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateCommentDto) {
    // 兼容不同的 userId 字段
    const userId = req.user.id || req.user.userId || req.user.sub;
    return this.commentsService.create(userId, dto.targetType, dto.targetId, dto.content, dto.mentionedIds);
  }

  @Get(':type/:id')
  async findByTarget(
    @Param('type') type: string,
    @Param('id') id: string
  ) {
    return this.commentsService.getComments(type.toUpperCase(), parseInt(id));
  }
}