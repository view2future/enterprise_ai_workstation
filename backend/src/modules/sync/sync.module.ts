import { Module } from '@nestjs/common';
import { SyncController } from './controllers/sync.controller';
import { SyncService } from './services/sync.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
