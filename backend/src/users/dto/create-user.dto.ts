import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserType } from 'generated/prisma/enums';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserType)
  type: UserType;

  @IsOptional()
  @IsString()
  photo: string;

  @IsOptional()
  @IsString()
  phone: string;
}
