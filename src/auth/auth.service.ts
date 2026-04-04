import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginDto, AuthResponseDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<AuthResponseDto> {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.usersService.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.usersService.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.usersService.sanitizeUser(user),
      ...tokens,
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.usersService.sanitizeUser(user);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_SECRET || 'fanscript-secret-key', expiresIn: '15m' }
      ),
      this.jwtService.signAsync(
        { sub: userId, type: 'refresh' },
        { secret: process.env.JWT_REFRESH_SECRET || 'fanscript-refresh-secret', expiresIn: '7d' }
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
