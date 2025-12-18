/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsDateString, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsUUID()
  clientId: string;

  @IsUUID()
  businessId: string;
}
