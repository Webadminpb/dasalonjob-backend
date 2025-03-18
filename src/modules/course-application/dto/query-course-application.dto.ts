import { CourseType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { z } from 'zod';

export const QueryCourseApplicationSchema = z.object({
  status: z.nativeEnum(CourseType).optional(),
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  search: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  courseId: z.string().optional(),
  location: z.string().optional(),
  languageId: z.string().optional(),
  customDate: zDateOptional,
  customerYear: zDateOptional,
});

export class QueryCourseApplicationDto extends createZodDto(
  QueryCourseApplicationSchema,
) {}
