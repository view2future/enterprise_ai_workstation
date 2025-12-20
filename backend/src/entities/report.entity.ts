import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsString, IsOptional, IsIn, IsNumber, IsDateString, Length, IsUrl } from 'class-validator';

export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export enum ReportType {
  SUMMARY = 'summary',
  DETAILED = 'detailed',
  TRENDS = 'trends',
  PRIORITY = 'priority',
  AI_USAGE = 'ai_usage',
  REGIONAL = 'regional',
  PARTNER = 'partner',
}

@Entity('reports')
@Index(['status'])
@Index(['type'])
@Index(['created_at'])
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'title', length: 255 })
  @IsString()
  @Length(1, 255)
  title: string;

  @Column({ 
    type: 'varchar', 
    name: 'type',
    enum: ReportType,
  })
  @IsIn([ReportType.SUMMARY, ReportType.DETAILED, ReportType.TRENDS, ReportType.PRIORITY, ReportType.AI_USAGE, ReportType.REGIONAL, ReportType.PARTNER])
  type: ReportType;

  @Column({ 
    type: 'varchar', 
    name: 'format',
    enum: ReportFormat,
  })
  @IsIn([ReportFormat.PDF, ReportFormat.EXCEL, ReportFormat.CSV, ReportFormat.JSON])
  format: ReportFormat;

  @Column({ 
    type: 'varchar', 
    name: 'status',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  @IsIn([ReportStatus.PENDING, ReportStatus.PROCESSING, ReportStatus.COMPLETED, ReportStatus.FAILED])
  status: ReportStatus;

  @Column({ type: 'text', name: 'description', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: 'jsonb', name: 'filters', nullable: true })
  @IsOptional()
  filters?: any;

  @Column({ type: 'jsonb', name: 'configuration', nullable: true })
  @IsOptional()
  configuration?: any;

  @Column({ type: 'varchar', name: 'file_path', nullable: true })
  @IsOptional()
  @IsUrl()
  filePath?: string;

  @Column({ type: 'varchar', name: 'file_name', nullable: true })
  @IsOptional()
  @IsString()
  fileName?: string;

  @Column({ type: 'int', name: 'data_count', default: 0 })
  @IsNumber()
  dataCount: number;

  @Column({ type: 'int', name: 'progress', default: 0 }) // 0-100
  @IsNumber()
  progress: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  @IsOptional()
  @IsDateString()
  completed_at?: Date;

  @Column({ type: 'varchar', name: 'created_by', nullable: true })
  @IsOptional()
  @IsString()
  created_by?: string;

  @Column({ type: 'text', name: 'error_message', nullable: true })
  @IsOptional()
  @IsString()
  errorMessage?: string;
}