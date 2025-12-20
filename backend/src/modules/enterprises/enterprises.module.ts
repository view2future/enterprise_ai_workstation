import { Module } from '@nestjs/common';
import { EnterprisesService } from './services/enterprises.service';
import { EnterprisesController } from './controllers/enterprises.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EnterprisesController],
  providers: [EnterprisesService, PrismaService],
  exports: [EnterprisesService],
})
export class EnterprisesModule {}