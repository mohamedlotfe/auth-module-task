import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  RefreshDto,
  AuthResponseDto,
  AuthenticatedRequest,
} from './dto';
import { JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  async signin(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signin(signInDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshDto: RefreshDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshDto: RefreshDto): Promise<{ message: string }> {
    return this.authService.logout(refreshDto.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return {
      id: user.userId,
      email: user.email,
      roles: user.roles,
    };
  }
}
