import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Booking, Prisma } from '@/generated/prisma/client';
import { QueryBookingDto } from './dto/query-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookingDto): Promise<Booking> {
    return this.prisma.booking.create({ data });
  }

  async findAll(clientId: string, query: QueryBookingDto) {
    const { search, sortName, page = 1, limit = 10 } = query;

    const where: Prisma.BookingWhereInput = { clientId };

    if (search) {
      where.business = {
        is: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      };
    }

    const orderBy: Prisma.BookingOrderByWithRelationInput = {};

    if (sortName) {
      orderBy.business = {
        name: sortName,
      };
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const [items, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy,
      }),

      this.prisma.booking.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  async findOne(id: string, clientId: string): Promise<Booking | null> {
    return this.prisma.booking.findFirst({
      where: { id, clientId },
    });
  }

  async update(id: string, data: UpdateBookingDto): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Booking> {
    return this.prisma.booking.delete({ where: { id } });
  }
}
