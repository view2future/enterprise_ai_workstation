import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 验证用户并返回环境权限
   */
  async validateUser(emailOrUsername: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ],
        status: 'active'
      },
    });

    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * 普通登录 (生产环境)
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('凭据无效，请检查账号密码');
    }

    // 生产模式下的用户只能看到 PROD 数据 (除非在 DB 里被手动设为了其他)
    const payload = { 
      sub: user.id, 
      username: user.username,
      role: user.role,
      env: user.envScope // 核心：注入环境标识
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  /**
   * 演示模式快捷登录
   */
  async loginDemo() {
    const demoUser = await this.prisma.user.findFirst({
      where: { envScope: 'DEMO', status: 'active' }
    });

    if (!demoUser) {
      throw new UnauthorizedException('演示环境暂未就绪');
    }

    const payload = {
      sub: demoUser.id,
      username: demoUser.username,
      role: demoUser.role,
      env: 'DEMO' // 强制指定环境
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: demoUser,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, status: 'active' },
    });

    if (!user) throw new UnauthorizedException('用户无效');
    
    // 显式排除密码并返回
    const { password, ...result } = user;
    return result;
  }
}
