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
  UseGuards,
  Request
} from '@nestjs/common';
import { EnterprisesService } from '../services/enterprises.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto, EnterpriseFilterDto } from '../dto/enterprise.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('enterprises')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class EnterprisesController {
  constructor(private readonly enterprisesService: EnterprisesService) {}

  @Get('stats/summary')
  async getStatistics(@Request() req) {
    return this.enterprisesService.getStatistics(req.user.env);
  }

  @Get('action/map-data-full')
  async getMapData(@Request() req) {
    return this.enterprisesService.findAll({ limit: 1000, page: 0 }, req.user.env);
  }

  @Get()
  async findAll(@Query() filters: EnterpriseFilterDto, @Request() req) {
    return this.enterprisesService.findAll(filters, req.user.env);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    return this.enterprisesService.findOne(id, req.user.env);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEnterpriseDto: CreateEnterpriseDto, @Request() req) {
    return this.enterprisesService.create(createEnterpriseDto, req.user.env);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEnterpriseDto: UpdateEnterpriseDto, @Request() req) {
    return this.enterprisesService.update(id, updateEnterpriseDto, req.user.env);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    return this.enterprisesService.remove(id, req.user.env);
  }
}