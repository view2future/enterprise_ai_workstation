import { IsString, IsOptional, IsNumber, IsDateString, IsIn, Min, Max, Length, IsEnum, IsBoolean, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';

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
  @Length(1, 1000)
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

  // 扩展字段
  @IsOptional() @IsString() unifiedSocialCreditCode?: string;
  @IsOptional() @IsString() legalRepresentative?: string;
  @IsOptional() @IsString() enterpriseType?: string;
  @IsOptional() @IsString() annualRevenue?: string;
  @IsOptional() @IsNumber() techStaffCount?: number;
  @IsOptional() @IsBoolean() isHighTech?: boolean;
  @IsOptional() @IsBoolean() isSpecialized?: boolean;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() officeAddress?: string;
  @IsOptional() @IsString() paddleUsageLevel?: string;
  @IsOptional() @IsJSON() paddleModels?: any;
  @IsOptional() @IsString() paddleTrainingType?: string;
  @IsOptional() @IsString() ernieModelType?: string;
  @IsOptional() @IsJSON() ernieAppScenarios?: any;
  @IsOptional() @IsNumber() promptTemplateCount?: number;
  @IsOptional() @IsNumber() avgMonthlyApiCalls?: number;
  @IsOptional() @IsNumber() peakApiCalls?: number;
  @IsOptional() @IsString() inferenceComputeType?: string;
  @IsOptional() @IsString() aiImplementationStage?: string;
  @IsOptional() @IsString() partnerProgramType?: string;
  @IsOptional() @IsJSON() baiduCertificates?: any;
  @IsOptional() @IsJSON() eventParticipation?: any;
  @IsOptional() @IsJSON() jointSolutions?: any;
  @IsOptional() @IsBoolean() isBaiduVenture?: boolean;
  @IsOptional() @IsJSON() trainingRecord?: any;
  @IsOptional() @IsJSON() awardsReceived?: any;
  @IsOptional() @IsString() lastContactDept?: string;
}

export class UpdateEnterpriseDto {
  @IsOptional() @IsString() @Length(1, 255) 企业名称?: string;
  @IsOptional() @IsString() 飞桨_文心?: string;
  @IsOptional() @IsString() 优先级?: string;
  @IsOptional() @IsNumber() 注册资本?: number;
  @IsOptional() @IsString() status?: string;
  
  // 允许所有扩展字段更新
  @IsOptional() @IsString() unifiedSocialCreditCode?: string;
  @IsOptional() @IsString() legalRepresentative?: string;
  @IsOptional() @IsString() enterpriseType?: string;
  @IsOptional() @IsString() annualRevenue?: string;
  @IsOptional() @IsNumber() techStaffCount?: number;
  @IsOptional() @IsBoolean() isHighTech?: boolean;
  @IsOptional() @IsBoolean() isSpecialized?: boolean;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() officeAddress?: string;
  @IsOptional() @IsString() paddleUsageLevel?: string;
  @IsOptional() paddleModels?: any;
  @IsOptional() @IsString() paddleTrainingType?: string;
  @IsOptional() @IsString() ernieModelType?: string;
  @IsOptional() ernieAppScenarios?: any;
  @IsOptional() @IsNumber() promptTemplateCount?: number;
  @IsOptional() @IsNumber() avgMonthlyApiCalls?: number;
  @IsOptional() @IsNumber() peakApiCalls?: number;
  @IsOptional() @IsString() inferenceComputeType?: string;
  @IsOptional() @IsString() aiImplementationStage?: string;
  @IsOptional() @IsString() partnerProgramType?: string;
  @IsOptional() baiduCertificates?: any;
  @IsOptional() eventParticipation?: any;
  @IsOptional() jointSolutions?: any;
  @IsOptional() @IsBoolean() isBaiduVenture?: boolean;
  @IsOptional() trainingRecord?: any;
  @IsOptional() awardsReceived?: any;
  @IsOptional() @IsString() lastContactDept?: string;
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
  @IsString()
  base?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  registeredCapitalMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  registeredCapitalMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  employeeCountMin?: number;

  @IsOptional()
  @Type(() => Number)
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
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(2000)
  limit?: number;
}