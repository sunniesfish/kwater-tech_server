import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { LoginResponseDto } from './dto/login-response.dto';
import { ManagerService } from '../manager/manager.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly managerService: ManagerService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '관리자 로그인' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { accessToken } = await this.authService.login(loginDto, res);
    const manager = await this.authService.validateUser(
      loginDto.managerId,
      loginDto.password,
    );
    if (!manager) {
      throw new UnauthorizedException(
        'Invalid credentials after login success? This should not happen.',
      );
    }
    return {
      managerId: manager.managerId,
      managerName: manager.managerName,
      accessToken,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '로그아웃' })
  @ApiOkResponse({
    description: '로그아웃 성공',
    type: Boolean,
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  async logout(@Request() req): Promise<boolean> {
    await this.authService.logout(req.user.clientId);
    return true;
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'JWT 토큰 갱신' })
  @ApiOkResponse({
    description: '토큰 갱신 성공',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Refresh 토큰이 유효하지 않음' })
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found in cookies');
    }
    const { accessToken, managerId } = await this.authService.refresh(
      refreshToken,
      res,
    );
    const manager = await this.managerService.findOne(managerId);
    if (!manager) {
      throw new UnauthorizedException('Manager not found for refreshed token');
    }
    return {
      accessToken,
      managerId: manager.managerId,
      managerName: manager.managerName,
    };
  }

  @Post('checkPassword')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '비밀번호 확인' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: '비밀번호 확인 결과',
    type: Boolean,
  })
  @ApiUnauthorizedResponse({ description: '인증되지 않은 사용자' })
  async checkPassword(@Body() loginDto: LoginDto) {
    return await this.authService.checkPassword(
      loginDto.managerId,
      loginDto.password,
    );
  }
}
