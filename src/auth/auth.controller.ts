import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request, Res, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, AuthResponseDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Request() req): Promise<AuthResponseDto> {
    return this.authService.refreshTokens(req.user.id, '');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async me(@Request() req) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout() {
    return { message: 'Logged out successfully' };
  }

  @Get('google')
  @UseGuards()
  @ApiOperation({ summary: 'Login with Google' })
  async googleAuth() {
    // This initiates OAuth flow
  }

  @Get('google/callback')
  @UseGuards()
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Request() req) {
    // Handle callback
    return this.authService.handleGoogleLogin(req.user);
  }
}
