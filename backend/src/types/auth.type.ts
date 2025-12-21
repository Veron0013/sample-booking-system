import { PickType } from '@nestjs/mapped-types';
import { User } from 'generated/prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request } from 'express';

export type DataToken = {
  access_token: string;
  refresh_token: string;
};

export class DataCredentials extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}

export type JwtPayload = {
  sub: User['id'];
  email: User['email'];
};

export type JwtData = {
  userId: User['id'];
  email: User['email'];
};
