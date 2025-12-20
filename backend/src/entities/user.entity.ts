import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsString, IsEmail, IsOptional, IsIn, Length, IsNumber } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  ANALYST = 'analyst',
  OPERATOR = 'operator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
@Index(['email'])
@Index(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  @IsString()
  @Length(3, 50)
  username: string;

  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar' })
  @IsString()
  @Length(6, 100)
  password: string; // 加密后的密码

  @Column({ type: 'varchar', name: 'first_name', nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Column({ type: 'varchar', name: 'last_name', nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Column({ 
    type: 'varchar', 
    default: UserRole.ANALYST,
    enum: UserRole 
  })
  @IsIn([UserRole.ADMIN, UserRole.ANALYST, UserRole.OPERATOR])
  role: UserRole;

  @Column({ 
    type: 'varchar', 
    default: UserStatus.ACTIVE,
    enum: UserStatus
  })
  @IsIn([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED])
  status: UserStatus;

  @Column({ type: 'timestamptz', name: 'last_login', nullable: true })
  lastLogin?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}