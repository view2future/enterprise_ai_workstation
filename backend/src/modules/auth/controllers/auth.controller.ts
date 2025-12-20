import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, UpdateUserDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../../../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    // 检查是否是演示账户
    if (loginDto.email === 'demo@example.com' && loginDto.password === 'password123') {
      // 返回演示用户信息
      const demoUser = {
        id: 999,
        email: 'demo@example.com',
        username: 'demo_user',
        role: 'analyst',
        status: 'active',
        firstName: 'Demo',
        lastName: 'User',
      };
      
      const payload = { 
        email: demoUser.email, 
        sub: demoUser.id, 
        role: demoUser.role 
      };
      
      return {
        access_token: this.authService.generateToken(payload),
        user: demoUser,
      };
    }
    
    // 对于非演示账户，执行正常的登录流程
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials'); // This would be handled by the guard normally
    }
    
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };
    
    return {
      access_token: this.authService.generateToken(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req) {
    // 检查是否是演示用户
    if (req.user.email === 'demo@example.com') {
      return {
        id: 999,
        email: 'demo@example.com',
        username: 'demo_user',
        role: 'analyst',
        status: 'active',
        firstName: 'Demo',
        lastName: 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: { currentPassword: string; newPassword: string },
  ) {
    // 演示用户不允许更改密码
    if (req.user.email === 'demo@example.com') {
      throw new Error('演示用户不允许更改密码');
    }
    
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}