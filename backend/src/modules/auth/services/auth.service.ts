import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: username }, { username: username }],
        status: 'active'
      },
    });

    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) throw new UnauthorizedException('凭据无效');

    const payload = { 
      sub: user.id, 
      username: user.username,
      role: user.role,
      envScope: user.envScope // 统一锁定 Key
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async loginDemo() {
    try {
      // 按照用户要求，直接使用特定的演示账号 demo_manager_sw
      const demoUser = await this.prisma.user.findFirst({
        where: { username: 'demo_manager_sw', envScope: 'DEMO', status: 'active' }
      });

      if (!demoUser) {
        this.logger.error('DEMO user demo_manager_sw not found in database');
        throw new UnauthorizedException('演示账号 demo_manager_sw 未就绪，请运行种子脚本初始化');
      }

      const payload = {
        sub: demoUser.id,
        username: demoUser.username,
        role: demoUser.role,
        envScope: demoUser.envScope || 'DEMO'
      };

      this.logger.log(`Demo login successful for user: ${demoUser.username}`);

      return {
        access_token: this.jwtService.sign(payload),
        user: demoUser,
      };
    } catch (error) {
      this.logger.error(`Login Demo Failed: ${error.message}`, error.stack);
      // 如果是 UnauthorizedException 直接抛出，否则抛出 InternalServerError
      throw error;
    }
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, status: 'active' },
    });
    if (!user) throw new UnauthorizedException('用户无效');
    const { password, ...result } = user;
    return result;
  }
}
