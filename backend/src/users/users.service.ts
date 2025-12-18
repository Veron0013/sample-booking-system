import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UserType } from '@/generated/prisma/enums';
import { User } from '@/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        photo: dto.photo || '',
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ where: { type: UserType.BUSINESS } });
  }

  //findAll(type?: UserType) {
  //  return this.prisma.user.findMany({
  //    where: type ? { type } : undefined,
  //  });
  //}

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    if (data.password?.trim()) {
      data.password = await bcrypt.hash(data.password.trim(), 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
