import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { SignUpDto, SignInDto, AuthResponseDto } from './dto';
import { TokenService, PasswordService } from './services';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, name, confirmPassword } = signUpDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const passwordHash = await this.passwordService.hashPassword(password);

    const user = await this.usersService.create({
      email,
      name,
      passwordHash,
      roles: ['user'],
    });

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokenPair(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  async signin(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.comparePasswords(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokenPair(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  async refresh(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const { userId, tokenId } =
        this.tokenService.verifyRefreshToken(refreshToken);

      const isValid = await this.refreshTokenRepository.isTokenValid(tokenId);
      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      await this.refreshTokenRepository.deleteBy(tokenId);

      const tokens = await this.tokenService.generateTokenPair(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    try {
      const { tokenId } = this.tokenService.verifyRefreshToken(refreshToken);

      await this.refreshTokenRepository.deleteBy(tokenId);

      return { message: 'Logged out successfully' };
    } catch {
      return { message: 'Logged out successfully' };
    }
  }

  async logoutAll(userId: string): Promise<{ message: string }> {
    await this.refreshTokenRepository.deleteByUserId(userId);
    return { message: 'Logged out from all devices successfully' };
  }
}
