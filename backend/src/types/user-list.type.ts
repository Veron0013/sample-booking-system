import { User } from 'generated/prisma/client';

export type UserDataType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  items: PublicUser[];
};

export type PublicUser = Omit<
  User,
  'password' | 'createdAt' | 'updatedAt' | 'isVerified'
>;

export type DataTokens = {
  access_token: string;
  refresh_token: string;
};

export type DataCredentials = {
  email: string;
  password: string;
};
