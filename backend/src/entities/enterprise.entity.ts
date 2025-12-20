import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsString, IsOptional, IsNumber, IsDateString, IsIn, Length, Min, Max } from 'class-validator';

@Entity('enterprises')
@Index(['企业名称'])
@Index(['飞桨_文心'])
@Index(['线索入库时间'])
@Index(['线索更新时间'])
@Index(['优先级'])
export class Enterprise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: '企业名称', unique: true })
  @IsString()
  @Length(1, 255)
  企业名称: string;

  @Column({ type: 'varchar', name: '飞桨_文心', nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['飞桨', '文心', null])
  飞桨_文心?: string;

  @Column({ type: 'varchar', name: '线索入库时间', nullable: true })
  @IsOptional()
  @IsString()
  线索入库时间?: string; // 格式: YYYYQ[1-4]

  @Column({ type: 'timestamptz', name: '线索更新时间', nullable: true })
  @IsOptional()
  @IsDateString()
  线索更新时间?: Date;

  @Column({ type: 'varchar', name: '伙伴等级', nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['认证级', '优选级', '无', null])
  伙伴等级?: string;

  @Column({ type: 'text', name: '生态AI产品', nullable: true })
  @IsOptional()
  @IsString()
  生态AI产品?: string;

  @Column({ type: 'varchar', name: '优先级', nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['P0', 'P1', 'P2', null])
  优先级?: string;

  @Column({ type: 'text', name: 'base', nullable: true })
  @IsOptional()
  @IsString()
  base?: string;

  @Column({ type: 'bigint', name: '注册资本', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  注册资本?: number;

  @Column({ type: 'integer', name: '参保人数', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  参保人数?: number;

  @Column({ type: 'text', name: '企业背景', nullable: true })
  @IsOptional()
  @IsString()
  @Length(50, 200, { message: '企业背景长度必须在50-200个字符之间' })
  企业背景?: string;

  @Column({ type: 'jsonb', name: '行业', nullable: true })
  @IsOptional()
  行业?: any;

  @Column({ type: 'text', name: '任务方向', nullable: true })
  @IsOptional()
  @IsString()
  任务方向?: string;

  @Column({ type: 'text', name: '联系人信息', nullable: true })
  @IsOptional()
  @IsString()
  联系人信息?: string;

  @Column({ type: 'text', name: '使用场景', nullable: true })
  @IsOptional()
  @IsString()
  使用场景?: string;

  @Column({ type: 'varchar', name: 'status', default: 'active' })
  @IsString()
  @IsIn(['active', 'inactive', 'deleted'])
  status: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;

  @Column({ type: 'varchar', name: 'created_by', nullable: true })
  @IsOptional()
  @IsString()
  created_by?: string;

  @Column({ type: 'varchar', name: 'updated_by', nullable: true })
  @IsOptional()
  @IsString()
  updated_by?: string;
}