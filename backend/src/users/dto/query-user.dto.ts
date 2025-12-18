/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  search?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortName?: 'asc' | 'desc';

  @IsOptional()
  @Transform(({ value }) => parseNumeric(value, 1))
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseNumeric(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;
}

function parseNumeric(value: string | number, defaultValue: number): number {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  // Прибираємо лапки "2" -> 2
  const cleaned = String(value).replace(/"/g, '').trim();

  const num = Number(cleaned);

  if (Number.isNaN(num) || num < 1) {
    throw new Error(`Invalid numeric value: ${value}`);
  }

  return num;
}
