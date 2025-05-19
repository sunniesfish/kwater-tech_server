import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logout(@Request() req) {
    return this.authService.logout(req.user.clientId);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    return this.authService.refresh(refreshToken, res);
  }

  @Post('checkPassword')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async checkPassword(@Body() loginDto: LoginDto) {
    const isValid = await this.authService.checkPassword(
      loginDto.divisionId,
      loginDto.password,
    );
    return { isValid };
  }
}
