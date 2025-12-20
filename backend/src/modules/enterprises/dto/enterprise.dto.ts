import { IsString, IsOptional, IsNumber, IsDateString, IsIn, Min, Max, Length, IsEnum } from 'class-validator';

export enum Priority {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
}

export enum PartnerLevel {
  认证级 = '认证级',
  优选级 = '优选级',
  无 = '无',
}

export enum FeiJiangWenXin {
  飞桨 = '飞桨',
  文心 = '文心',
}

export class CreateEnterpriseDto {
  @IsString()
  @Length(1, 255)
  企业名称: string;

  @IsOptional()
  @IsString()
  @IsIn(['飞桨', '文心'])
  飞桨_文心?: string;

  @IsOptional()
  @IsString()
  线索入库时间?: string;

  @IsOptional()
  @IsString()
  @IsIn(['认证级', '优选级', '无'])
  伙伴等级?: string;

  @IsOptional()
  @IsString()
  生态AI产品?: string;

  @IsOptional()
  @IsString()
  @IsIn(['P0', 'P1', 'P2'])
  优先级?: string;

  @IsOptional()
  @IsString()
  base?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  注册资本?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  参保人数?: number;

  @IsOptional()
  @IsString()
  @Length(50, 200)
  企业背景?: string;

  @IsOptional()
  行业?: any;

  @IsOptional()
  @IsString()
  任务方向?: string;

  @IsOptional()
  @IsString()
  联系人信息?: string;

  @IsOptional()
  @IsString()
  使用场景?: string;
}

export class UpdateEnterpriseDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  企业名称?: string;

  @IsOptional()
  @IsString()
  @IsIn(['飞桨', '文心'])
  飞桨_文心?: string;

  @IsOptional()
  @IsString()
  线索入库时间?: string;

  @IsOptional()
  @IsString()
  @IsIn(['认证级', '优选级', '无'])
  伙伴等级?: string;

  @IsOptional()
  @IsString()
  生态AI产品?: string;

  @IsOptional()
  @IsString()
  @IsIn(['P0', 'P1', 'P2'])
  优先级?: string;

  @IsOptional()
  @IsString()
  base?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  注册资本?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  参保人数?: number;

  @IsOptional()
  @IsString()
  @Length(50, 200)
  企业背景?: string;

  @IsOptional()
  行业?: any;

  @IsOptional()
  @IsString()
  任务方向?: string;

  @IsOptional()
  @IsString()
  联系人信息?: string;

  @IsOptional()
  @IsString()
  使用场景?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'deleted'])
  status?: string;
}

export class EnterpriseFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  feijiangWenxin?: string;

  @IsOptional()
  @IsString()
  clueInTime?: string;

  @IsOptional()
  @IsString()
  partnerLevel?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  taskDirection?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  registeredCapitalMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  registeredCapitalMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  employeeCountMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  employeeCountMax?: number;

  @IsOptional()
  @IsString()
  sort_field?: string;

  @IsOptional()
  @IsString()
  sort_direction?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}