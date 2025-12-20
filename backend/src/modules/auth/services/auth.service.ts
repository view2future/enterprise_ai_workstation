import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email, status: 'active' },
    });

    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  generateToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Check if it's the demo account
    if (email === 'demo@example.com' && password === 'password123') {
      const demoUser = {
        id: 999,
        email: 'demo@example.com',
        username: 'demo_user',
        role: 'analyst',
        status: 'active',
        firstName: 'Demo',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const payload = { 
        email: demoUser.email, 
        sub: demoUser.id, 
        role: demoUser.role 
      };
      
      return {
        access_token: this.generateToken(payload),
        user: demoUser,
      };
    }
    
    // Perform normal login validation
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    
    return {
      access_token: this.generateToken(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { username: registerDto.username }
        ]
      }
    });

    if (existingUser) {
      throw new BadRequestException('邮箱或用户名已存在');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
        role: 'analyst', // Default to analyst role
        status: 'active',
      }
    });

    // Return user info without password
    const { password, ...result } = user;
    return result;
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, status: 'active' },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    const { password, ...result } = user;
    return result;
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, status: 'active' },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    // Validate current password
    if (!await bcrypt.compare(currentPassword, user.password)) {
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
      }
    });

    return { message: '密码修改成功' };
  }
}