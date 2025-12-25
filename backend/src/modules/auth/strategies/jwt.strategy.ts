import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 终极对齐：必须与 AuthModule 里的 secret 字符串一字不差
      secretOrKey: 'liantu-nexus-secret-v5-2025',
    });
  }

  async validate(payload: any) {
    // 如果没有 sub，说明 Token 载荷有问题
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token payload invalid');
    }
    
    // 注入全字段，确保控制器和拦截器都能取到 ID
    return { 
      sub: payload.sub,
      id: payload.sub,
      userId: payload.sub,
      username: payload.username, 
      role: payload.role,
      envScope: payload.envScope || 'PROD'
    };
  }
}