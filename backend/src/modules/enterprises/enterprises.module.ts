import { Module } from '@nestjs/common';
import { EnterprisesService } from './services/enterprises.service';
import { EnterprisesController } from './controllers/enterprises.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { NlpParserService } from './services/nlp-parser.service';

@Module({
  controllers: [EnterprisesController],
  providers: [EnterprisesService, PrismaService, NlpParserService],
  exports: [EnterprisesService, NlpParserService],
})
export class EnterprisesModule {}