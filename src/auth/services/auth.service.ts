import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/models/user.schema';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UserDocument, 'password' | 'currentHashedRefreshToken'>> {
    try {
      const user = await this.usersService.createUser(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { currentHashedRefreshToken, ...result } = user as any;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to sign up user: ${createUserDto.username}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not sign up user.');
    }
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { username, password } = loginDto;
    const user = await this.usersService.findUserByUsername(username);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateAndStoreTokens(user);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.setCurrentRefreshToken(userId, null);
  }

  async refreshTokens(
    userId: string,
    clientRefreshToken: string,
  ): Promise<Tokens> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const doesMatch = await this.usersService.doesRefreshTokenMatch(
      userId,
      clientRefreshToken,
    );
    if (!doesMatch) {
      await this.usersService.setCurrentRefreshToken(userId, null);
      throw new UnauthorizedException(
        'Invalid refresh token. Please log in again.',
      );
    }

    const tokens = await this.generateAndStoreTokens(user);
    return tokens;
  }

  private async generateAndStoreTokens(user: UserDocument): Promise<Tokens> {
    const payload: TokenPayload = {
      username: user.username,
      sub: user._id.toString(),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    });

    await this.usersService.setCurrentRefreshToken(
      user._id.toString(),
      refreshToken,
    );

    return { accessToken, refreshToken };
  }
}
