import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Use email instead of username
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // 检查是否是演示账户
    if (email === 'demo@example.com' && password === 'password123') {
      return {
        id: 999,
        email: 'demo@example.com',
        username: 'demo_user',
        role: 'analyst',
        status: 'active',
      };
    }
    
    // 对于非演示账户，执行正常验证
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}