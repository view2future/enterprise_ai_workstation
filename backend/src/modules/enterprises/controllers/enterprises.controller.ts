import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards, Request, Logger
} from '@nestjs/common';
import { EnterprisesService } from '../services/enterprises.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, EnterpriseFilterDto } from '../dto/enterprise.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('enterprises')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class EnterprisesController {
  private readonly logger = new Logger(EnterprisesController.name);

  constructor(private readonly enterprisesService: EnterprisesService) {}

  @Get('stats/summary')
  async getStatistics(@Request() req) {
    this.logger.log(`[AUDIT] GET Statistics | Env: ${req.user.envScope}`);
    return this.enterprisesService.getStatistics(req.user.envScope);
  }

  @Get('action/map-data-full')
  async getMapData(@Request() req) {
    this.logger.log(`[AUDIT] GET MapData Full | Env: ${req.user.envScope}`);
    return this.enterprisesService.findAll({ limit: 1000, page: 0 }, req.user.envScope);
  }

  @Get()
  async findAll(@Query() filters: EnterpriseFilterDto, @Request() req) {
    this.logger.log(`[AUDIT] GET Enterprise List | Env: ${req.user.envScope} | Query: ${JSON.stringify(filters)}`);
    return this.enterprisesService.findAll(filters, req.user.envScope);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.enterprisesService.findOne(+id, req.user.envScope);
  }

  @Post('action/parse-unstructured')
  @HttpCode(HttpStatus.OK)
  async parseText(@Body('text') text: string) {
    return this.enterprisesService.parseUnstructured(text);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateEnterpriseDto, @Request() req) {
    return this.enterprisesService.create(createDto, req.user.envScope);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateEnterpriseDto, @Request() req) {
    return this.enterprisesService.update(+id, updateDto, req.user.envScope);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.enterprisesService.remove(+id, req.user.envScope);
  }
}