import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateUserDto } from '../../auth/dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id, status: 'active' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`用户ID ${id} 未找到`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { email, status: 'active' },
    });
  }

  async findByUsername(username: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { username, status: 'active' },
    });
  }

  async create(userData: Partial<any>): Promise<any> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ]
      }
    });

    if (existingUser) {
      throw new BadRequestException('邮箱或用户名已存在');
    }

    // Hash password if provided
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    const user = await this.prisma.user.create({
      data: {
        ...(userData as any),
        status: 'active',
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateData: UpdateUserDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id, status: 'active' },
    });

    if (!user) {
      throw new NotFoundException(`用户ID ${id} 未找到`);
    }

    // Check if username or email is already taken by another user
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: updateData.username },
      });
      if (existingUser) {
        throw new BadRequestException('用户名已存在');
      }
    }

    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateData.email },
      });
      if (existingUser) {
        throw new BadRequestException('邮箱已存在');
      }
    }

    // Don't allow password update through this method
    delete (updateData as any).password;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(updateData as any),
        updatedAt: new Date(),
      },
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id, status: 'active' },
    });

    if (!user) {
      throw new NotFoundException(`用户ID ${id} 未找到`);
    }

    await this.prisma.user.update({
      where: { id },
      data: { status: 'inactive', updatedAt: new Date() },
    });
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, status: 'active' },
    });

    if (!user) {
      throw new NotFoundException(`用户ID ${userId} 未找到`);
    }

    // Validate current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('当前密码错误');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, status: 'active' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`用户ID ${userId} 未找到`);
    }

    return user;
  }
}