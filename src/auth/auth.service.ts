import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
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
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(Connections.name)
    private readonly connectionsModel: Model<Connections>,
  ) {}

  async validateUser(divisionId: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(divisionId);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user.toObject();
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private generateTokens(divisionId: string, clientId: string) {
    const accessToken = this.jwtService.sign(
      { divisionId, clientId },
      { expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign(
      { divisionId, clientId },
      { expiresIn: '1d' },
    );
    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(
      loginDto.divisionId,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const clientId = uuidv4();
    const { accessToken, refreshToken } = this.generateTokens(
      user.divisionId,
      clientId,
    );

    // Save connection
    await this.connectionsModel.create({
      clientId,
      divisionId: user.divisionId,
      refreshToken,
      createdAt: new Date(),
      lastSeen: new Date(),
    });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
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
      const { divisionId, clientId } = payload;

      // Check if connection exists and is valid
      const connection = await this.connectionsModel.findOne({ clientId });
      if (!connection || connection.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const newTokens = this.generateTokens(divisionId, clientId);

      // Update connection
      await this.connectionsModel.updateOne(
        { clientId },
        {
          refreshToken: newTokens.refreshToken,
          lastSeen: new Date(),
        },
      );

      // Set new refresh token in cookie
      res.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return { accessToken: newTokens.accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async checkPassword(divisionId: string, password: string): Promise<boolean> {
    const user = await this.validateUser(divisionId, password);
    return !!user;
  }
}
