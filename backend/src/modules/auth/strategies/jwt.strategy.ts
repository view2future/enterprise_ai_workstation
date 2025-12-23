import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'ENTERPRISE_SECRET_2025',
    });
  }

  async validate(payload: any) {
    // 兼容性提取：支持新旧两种 Key
    const env = payload.envScope || payload.env || 'PROD';
    
    const context = {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
      envScope: env // 统一向下游传递 envScope
    };

    return context;
  }
}