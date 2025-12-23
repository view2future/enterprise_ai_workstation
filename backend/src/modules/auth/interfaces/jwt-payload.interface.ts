export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  env: string; // 新增环境标识
  iat?: number;
  exp?: number;
}
