
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service.js';
import { RegisterDto } from './register.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.usersService.register(data);
  }

  @Post('login')
  login(@Body() data: { email: string; password: string }) {
    return this.usersService.login(data);
  }

@Post('forgot-password')
forgotPassword(@Body() data: { email: string }) {
  console.log('FORGOT PASSWORD ENDPOINT HIT');

  return this.usersService.forgotPassword(data);
}

  @Post('reset-password')
  resetPassword(
    @Body() data: { token: string; newPassword: string },
  ) {
    return this.usersService.resetPassword(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      message: 'Access granted.',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
