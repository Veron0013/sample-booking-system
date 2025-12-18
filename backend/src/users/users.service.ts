import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UserType } from '@/generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        photo: dto.photo || '',
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ where: { type: UserType.BUSINESS } });
  }

  //findAll(type?: UserType) {
  //  return this.prisma.user.findMany({
  //    where: type ? { type } : undefined,
  //  });
  //}

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserDto) {
    //const data = { ...updateUserDto };

    if (data.password?.trim()) {
      data.password = await bcrypt.hash(data.password.trim(), 10);
    }

    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
