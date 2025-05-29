import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ManagerService } from '../manager/manager.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Connections } from '../connections/schemas/connections.schema';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly managerService: ManagerService,
    private readonly jwtService: JwtService,
    @InjectModel(Connections.name)
    private readonly connectionsModel: Model<Connections>,
  ) {}

  async validateUser(managerId: string, password: string): Promise<any> {
    try {
      const manager = await this.managerService.findOne(managerId);
      if (!manager) return null;
      const isPasswordValid = await bcrypt.compare(password, manager.password);
      if (isPasswordValid) {
        const { password, ...result } = manager.toObject();
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private generateTokens(managerId: string, clientId: string) {
    const accessToken = this.jwtService.sign(
      { managerId, clientId },
      { expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign(
      { managerId, clientId },
      { expiresIn: '1d' },
    );
    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto, res: Response) {
    const manager = await this.validateUser(
      loginDto.managerId,
      loginDto.password,
    );
    if (!manager) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const clientId = uuidv4();
    const { accessToken, refreshToken } = this.generateTokens(
      manager.managerId,
      clientId,
    );

    await this.connectionsModel.create({
      clientId,
      managerId: manager.managerId,
      refreshToken,
      createdAt: new Date(),
      lastSeen: new Date(),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  async logout(clientId: string) {
    await this.connectionsModel.deleteOne({ clientId });
    return { message: 'Logged out successfully' };
  }

  async refresh(refreshToken: string, res: Response) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const { managerId, clientId } = payload;

      const connection = await this.connectionsModel.findOne({ clientId });
      if (!connection || connection.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newTokens = this.generateTokens(managerId, clientId);

      await this.connectionsModel.updateOne(
        { clientId },
        {
          refreshToken: newTokens.refreshToken,
          lastSeen: new Date(),
        },
      );

      res.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return { accessToken: newTokens.accessToken, managerId };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async checkPassword(managerId: string, password: string): Promise<boolean> {
    const manager = await this.validateUser(managerId, password);
    return !!manager;
  }
}
