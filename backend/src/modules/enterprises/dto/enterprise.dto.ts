import { IsString, IsOptional, IsInt, IsEnum, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum ClueStage {
  LEAD = 'LEAD',
  EMPOWERING = 'EMPOWERING',
  ADOPTED = 'ADOPTED',
  ECO_PRODUCT = 'ECO_PRODUCT',
  POWERED_BY = 'POWERED_BY',
  CASE_STUDY = 'CASE_STUDY'
}

export enum ClueSource {
  PHONE = 'PHONE',
  EVENT = 'EVENT',
  ASSOCIATION = 'ASSOCIATION',
  PARTNER = 'PARTNER',
  GOV = 'GOV'
}

export class CreateEnterpriseDto {
  @IsString()
  enterpriseName: string;

  @IsString()
  @IsOptional()
  feijiangWenxin?: string;

  // V4.0 新增字段
  @IsEnum(ClueStage)
  @IsOptional()
  clueStage?: ClueStage;

  @IsEnum(ClueSource)
  @IsOptional()
  clueSource?: ClueSource;

  @IsString()
  @IsOptional()
  clueSourceDetail?: string;

  @IsBoolean()
  @IsOptional()
  isPoweredBy?: boolean;

  @IsString()
  @IsOptional()
  pbAuthInfo?: string;

  @IsString()
  @IsOptional()
  awardStatus?: string;

  @IsDateString()
  @IsOptional()
  awardTime?: string;

  @IsString()
  @IsOptional()
  awardLocation?: string;

  @IsDateString()
  @IsOptional()
  certExpiryDate?: string;

  @IsString()
  @IsOptional()
  certStatus?: string;

  @IsString()
  @IsOptional()
  shippingStatus?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  partnerLevel?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  base?: string;

  @IsOptional()
  registeredCapital?: any;

  @IsInt()
  @IsOptional()
  employeeCount?: number;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  enterpriseBackground?: string;

  @IsString()
  @IsOptional()
  usageScenario?: string;

  @IsString()
  @IsOptional()
  taskDirection?: string;
  
  @IsString()
  @IsOptional()
  aiImplementationStage?: string;
}

export class UpdateEnterpriseDto extends CreateEnterpriseDto {}

export class EnterpriseFilterDto {
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsString()
  @IsOptional()
  keyword?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  base?: string;

  @IsString()
  @IsOptional()
  clueStage?: string;

  @IsString()
  @IsOptional()
  partnerLevel?: string;

  @IsString()
  @IsOptional()
  expiry?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number = 0;
}
