import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { VeracityService } from '../services/veracity.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('veracity')
@UseGuards(JwtAuthGuard)
export class VeracityController {
  constructor(private readonly veracityService: VeracityService) {}

  /**
   * 启动新的深猎任务
   */
  @Post('hunt')
  async startHunt(@Body('name') name: string, @Request() req) {
    return this.veracityService.createHuntTask(name, req.user.sub, req.user.envScope);
  }

  /**
   * 批量启动深猎任务
   */
  @Post('batch-hunt')
  async startBatchHunt(@Body('names') names: string[], @Request() req) {
    return this.veracityService.createBatchHuntTasks(names, req.user.sub, req.user.envScope);
  }

  /**
   * 获取所有进行中的任务
   */
  @Get('tasks/active')
  async getActiveTasks(@Request() req) {
    return this.veracityService.getActiveTasks(req.user.sub, req.user.envScope);
  }

  /**
   * 获取最近完成的任务
   */
  @Get('tasks/recent-completed')
  async getRecentCompleted(@Request() req) {
    return this.veracityService.getRecentlyCompleted(req.user.sub, req.user.envScope);
  }

  /**
   * 获取特定任务详情
   */
  @Get('tasks/:id')
  async getTask(@Param('id') id: string) {
    return this.veracityService.findOneTask(id);
  }
}
