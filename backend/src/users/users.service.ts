import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { UserType } from '@/generated/prisma/enums';
import { Prisma } from '@/generated/prisma/client';
import { PublicUser, UserDataType } from '@/types/user-list.type';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<PublicUser> {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        photo: dto.photo || '',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...safeUser } = user;

    return safeUser;
  }

  async findAll(id: string, query: QueryUserDto): Promise<UserDataType> {
    const { search, sortName, page = 1, limit = 10 } = query;

    const where: Prisma.UserWhereInput = { type: UserType.BUSINESS };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const orderBy = sortName
      ? ({ name: sortName } satisfies Prisma.UserOrderByWithRelationInput)
      : undefined;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        omit: { password: true },
      }),

      this.prisma.user.count({ where }),
    ]);

    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  async findOne(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<PublicUser> {
    if (data.password?.trim()) {
      data.password = await bcrypt.hash(data.password.trim(), 10);
    }

    return this.prisma.user.update({
      where: { id },
      omit: { password: true },
      data,
    });
  }

  async remove(id: string): Promise<PublicUser> {
    return this.prisma.user.delete({ where: { id }, omit: { password: true } });
  }
}
