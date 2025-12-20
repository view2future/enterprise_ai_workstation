import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SyncService } from '../services/sync.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('export')
  async exportData(@Query('since') since?: string) {
    return this.syncService.exportData(since);
  }

  @Post('import')
  async importData(@Body() body: { payload: any[] }) {
    return this.syncService.importData(body.payload);
  }

  @Post('validate')
  async validatePackage(@Body() body: { payload: any[] }) {
    // 简单的校验逻辑，返回冲突预览
    const preview = {
      toUpdate: 0,
      toCreate: 0,
      conflicts: [],
    };
    // 这里可以扩展更复杂的对比逻辑
    return preview;
  }
}
