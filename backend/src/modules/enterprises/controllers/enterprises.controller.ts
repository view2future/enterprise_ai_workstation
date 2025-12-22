import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EnterprisesService } from '../services/enterprises.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, EnterpriseFilterDto } from '../dto/enterprise.dto';

@Controller('enterprises')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class EnterprisesController {
  // VERSION: 2.0.5 - FORCE_REBUILD
  constructor(private readonly enterprisesService: EnterprisesService) {}

  // 1. 静态路由 (优先匹配)
  @Get('stats/summary')
  @HttpCode(HttpStatus.OK)
  async getStatistics() {
    return this.enterprisesService.getStatistics();
  }

  @Get('action/map-data-full')
  @HttpCode(HttpStatus.OK)
  async getMapData() {
    // 强制获取全量数据，绕过常规分页限制
    return this.enterprisesService.findAll({ limit: 1000, page: 0 });
  }

  // 2. 基础列表路由
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: EnterpriseFilterDto) {
    return this.enterprisesService.findAll(filters);
  }

  // 3. 参数化路由 (最后匹配)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return this.enterprisesService.findOne(id);
  }

  @Get(':id/detail')
  @HttpCode(HttpStatus.OK)
  async getEnterpriseDetail(@Param('id') id: number) {
    return this.enterprisesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEnterpriseDto: CreateEnterpriseDto) {
    return this.enterprisesService.create(createEnterpriseDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateEnterpriseDto: UpdateEnterpriseDto) {
    return this.enterprisesService.update(id, updateEnterpriseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    return this.enterprisesService.remove(id);
  }
}
