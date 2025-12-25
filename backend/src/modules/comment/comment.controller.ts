import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateCommentDto) {
    return this.commentService.create(req.user.id, dto);
  }

  @Get(':type/:id')
  async findByTarget(
    @Param('type') type: string,
    @Param('id') id: string
  ) {
    return this.commentService.findByTarget(type.toUpperCase(), parseInt(id));
  }
}
