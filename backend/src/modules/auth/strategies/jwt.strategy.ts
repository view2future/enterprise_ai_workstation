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
      secretOrKey: configService.get<string>('JWT_SECRET') || 'ENTERPRISE_SECRET_2025',
    });
  }

  async validate(payload: JwtPayload) {
    // 将 JWT 中的载荷直接映射到请求对象的 user 属性中
    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
      env: payload.env // 关键：向下游传递环境标识
    };
  }
}
