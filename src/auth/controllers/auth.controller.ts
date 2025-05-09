import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { User } from '../../users/models/user.schema';
import { LoginDto } from '../dto/login.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    username: string;
  };
}

interface RequestWithUserAndRefreshToken extends Request {
  user: {
    userId: string;
    username: string;
    refreshToken?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('Refresh', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password' | 'currentHashedRefreshToken'>> {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.login(loginDto);
    this.setRefreshTokenCookie(response, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(request.user.userId);
    this.clearRefreshTokenCookie(response);
    return { message: 'Successfully logged out' };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() request: RequestWithUserAndRefreshToken,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const userId = request.user.userId;
    const clientRefreshToken = request.user.refreshToken;

    if (!clientRefreshToken) {
      throw new Error('Refresh token not found in request.user from guard.');
    }

    const newTokens = await this.authService.refreshTokens(
      userId,
      clientRefreshToken,
    );
    this.setRefreshTokenCookie(response, newTokens.refreshToken);
    return { accessToken: newTokens.accessToken };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Req() request: RequestWithUser): {
    userId: string;
    username: string;
  } {
    return request.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/test')
  @HttpCode(HttpStatus.OK)
  adminTest(@Req() request: RequestWithUser): { message: string; user: any } {
    return {
      message: 'Admin test endpoint reached successfully.',
      user: request.user,
    };
  }
}
