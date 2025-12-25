import { Controller, Post, Get, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(@Body() dto: { targetType: string; targetId: number; content: string }, @Request() req) {
    return this.commentsService.addComment(req.user.userId, dto);
  }

  @Get()
  async getComments(@Query('type') type: string, @Query('id') id: string) {
    return this.commentsService.getComments(type, +id);
  }
}
