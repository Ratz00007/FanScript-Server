import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: this.sanitizedUserSelect(),
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    // If updating password, hash it first
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: this.sanitizedUserSelect(),
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async verifyEmail(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });
  }

  async verifyPhone(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { phoneVerified: true },
    });
  }

  sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }

  private sanitizedUserSelect() {
    return {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      avatar: true,
      emailVerified: true,
      phoneVerified: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
