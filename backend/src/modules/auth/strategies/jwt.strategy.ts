import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
    });
  }

  async validate(payload: JwtPayload) {
    // 检查是否是演示用户的JWT
    if (payload.email === 'demo@example.com') {
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    }

    // 对于非演示用户，从数据库验证
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}