import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
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

  async login(loginDto: any) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('凭据无效');
    }

    const payload = { 
      sub: user.id, 
      username: user.username, 
      role: user.role, 
      envScope: user.envScope 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async loginDemo() {
    try {
      this.logger.log('>>> EXECUTING DEMO LOGIN HANDSHAKE');
      
      const demoUser = await this.prisma.user.findFirst({
        where: { envScope: 'DEMO', status: 'active' }
      });

      if (!demoUser) {
        this.logger.error('No DEMO user found in database');
        throw new UnauthorizedException('演示环境未就绪');
      }

      const payload = { 
        sub: demoUser.id, 
        username: demoUser.username, 
        role: 'SUPER_ADMIN', 
        envScope: 'DEMO' 
      };

      this.logger.log(`>>> ISSUING TOKEN FOR: ${demoUser.username} WITH SCOPE: DEMO`);

      // 显式克隆对象，避免 Prisma Proxy 对象导致的序列化问题
      const userResult = {
        id: demoUser.id,
        username: demoUser.username,
        email: demoUser.email,
        role: 'SUPER_ADMIN',
        envScope: 'DEMO',
        status: demoUser.status
      };

      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        user: userResult,
      };
    } catch (err) {
      this.logger.error(`DEMO LOGIN FAILED: ${err.message}`, err.stack);
      throw err;
    }
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const { password, ...result } = user;
    return result;
  }
}
