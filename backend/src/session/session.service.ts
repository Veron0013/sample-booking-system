import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { DataToken } from 'src/types/auth.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { ONE_WEEK } from 'src/utils/constants';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async createUpdateUserSession(
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

  async update(userId: string, refreshHash: string) {
    return await this.prisma.session.update({
      where: { userId },
      data: {
        refreshHash,
        expiresAt: new Date(Date.now() + ONE_WEEK),
      },
    });
  }

  async checkSession(userId: string, refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { userId },
    });
    if (!session) throw new UnauthorizedException('Session not found');

    if (session.refreshHash !== refreshToken)
      throw new UnauthorizedException('Session not found');

    if (session.expiresAt < new Date(Date.now()))
      throw new UnauthorizedException('Session expired. Login please.');

    return;
  }

  async remove(userId: string) {
    const session = await this.prisma.session.findUnique({
      where: { userId },
    });

    if (!session) return;

    return await this.prisma.session.delete({ where: { id: session.id } });
  }
}
