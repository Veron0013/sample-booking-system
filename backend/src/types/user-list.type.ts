import { User } from '@/generated/prisma/client';

export type UserDataType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  items: User[];
};
