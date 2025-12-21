import { PickType } from '@nestjs/mapped-types';
import { User } from 'generated/prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export type DataToken = {
  access_token: string;
  refresh_token: string;
};

export class DataCredentials extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}

export type JwtPayload = {
  sub: string; // userId
  email: User['email'];
  type: 'USER' | 'ADMIN'; // або enum
};
