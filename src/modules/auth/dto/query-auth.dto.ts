import {
  AccountStatus,
  BusinessType,
  HighestEducation,
  Role,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/validation';
import { z } from 'zod';

export const QueryAuthSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  skillId: z.string().optional(),
  education: z.nativeEnum(HighestEducation).optional(),
  status: z.nativeEnum(AccountStatus).optional(),
  locations: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  countryId: z.string().optional(),
  date: zDateOptional.optional(),
  year: zYearOptional.optional(),
  businessType: z.nativeEnum(BusinessType).optional(),

  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z
    .enum(['createdAt', 'updatedAt', 'order', 'status'])
    .default('createdAt'),
});

export class QueryAuthDto extends createZodDto(QueryAuthSchema) {}
