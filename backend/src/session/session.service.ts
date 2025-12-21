import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { DataToken } from 'src/types/auth.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { ONE_WEEK } from 'src/utils/constants';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async createUserSession(
    userId: User['id'],
    refreshHash: DataToken['refresh_token'],
  ) {
    return this.prisma.session.upsert({
      where: { userId },
      update: {
        refreshHash,
        expiresAt: new Date(Date.now() + ONE_WEEK),
      },
      create: {
        userId,
        refreshHash,
        expiresAt: new Date(Date.now() + ONE_WEEK),
      },
    });
  }

  findAll() {
    return `This action returns all session`;
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
