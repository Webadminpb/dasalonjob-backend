import { CourseType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/validation';
import { z } from 'zod';

export const QuerySaveCourseSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  location: z.string().optional(),
  type: z.nativeEnum(CourseType).optional(),
  customDate: zDateOptional,
  customerYear: zYearOptional,
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z
    .enum(['createdAt', 'updatedAt', 'order', 'status'])
    .default('createdAt'),
});

export class QuerySaveCourseDto extends createZodDto(QuerySaveCourseSchema) {}
