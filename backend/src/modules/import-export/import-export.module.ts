import { Module } from '@nestjs/common';
import { ImportExportController } from './controllers/import-export.controller';
import { ImportExportService } from './services/import-export.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ImportExportController],
  providers: [ImportExportService, PrismaService],
  exports: [ImportExportService],
})
export class ImportExportModule {}