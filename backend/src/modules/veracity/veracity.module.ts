import { Module } from '@nestjs/common';
import { VeracityController } from './controllers/veracity.controller';
import { VeracityService } from './services/veracity.service';
import { SearchService } from './services/search.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VeracityController],
  providers: [VeracityService, SearchService],
  exports: [VeracityService],
})
export class VeracityModule {}
