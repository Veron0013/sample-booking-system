import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '../../generated/prisma/enums';
import { Prisma } from '../../generated/prisma/client';
import { PublicUser, UserDataType } from '../types/user.type';
import { QueryUserDto } from './dto/query-user.dto';
import { hashPassword, isPasswordsEqual } from 'src/utils/bcrypt.util';
import { DataCredentials } from 'src/types/auth.type';

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

    const hashedPassword = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        photo: dto.photo || '',
      },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        type: true,
        phone: true,
      },
    });

    return user;
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
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
          type: true,
          phone: true,
        },
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
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        type: true,
        phone: true,
      },
    });
  }

  async getValidUser(data: DataCredentials): Promise<PublicUser> {
    //console.log('getValidUser', data);
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await isPasswordsEqual(data.password, user.password);

    if (!isValid) throw new UnauthorizedException('Wrong password');

    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<PublicUser> {
    if (data.password?.trim()) {
      data.password = await hashPassword(data.password.trim());
    }

    return this.prisma.user.update({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        type: true,
        phone: true,
      },
      data,
    });
  }

  async remove(id: string): Promise<PublicUser> {
    const [user] = await this.prisma.$transaction([
      this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
          type: true,
          phone: true,
        },
      }),
      this.prisma.session.deleteMany({
        where: { userId: id },
      }),
    ]);

    return user;
  }
}
