import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        envScope: true,
        createdAt: true
      }
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, data: any) {
    const user = await this.findOne(id);
    return this.prisma.user.update({
      where: { id: user.id },
      data: { ...data, updatedAt: new Date() }
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.prisma.user.update({
      where: { id: user.id },
      data: { status: 'deleted' }
    });
  }
}
