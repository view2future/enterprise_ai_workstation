import { Controller, Post, Body, Get, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('common-sync')
  @HttpCode(HttpStatus.OK)
  async loginDemo() {
    try {
      console.log('[SYSTEM] Initializing settings sync (Demo)');
      return await this.authService.loginDemo();
    } catch (e) {
      console.error('[AUTH CONTROLLER ERROR]', e);
      return {
        status: 'error',
        message: e.message,
        stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
      };
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
}