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
import { Enterprise } from '../../../entities/enterprise.entity';

@Controller('enterprises')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class EnterprisesController {
  constructor(private readonly enterprisesService: EnterprisesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: EnterpriseFilterDto) {
    return this.enterprisesService.findAll(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
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

  @Get(':id/detail')
  @HttpCode(HttpStatus.OK)
  async getEnterpriseDetail(@Param('id') id: number) {
    return this.enterprisesService.findOne(id);
  }

  @Get('stats/summary')
  @HttpCode(HttpStatus.OK)
  async getStatistics() {
    return this.enterprisesService.getStatistics();
  }
}