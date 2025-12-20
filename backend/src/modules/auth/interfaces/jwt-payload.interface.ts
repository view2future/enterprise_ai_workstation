export interface JwtPayload {
  email: string;
  sub: number; // user ID
  role: string;
}