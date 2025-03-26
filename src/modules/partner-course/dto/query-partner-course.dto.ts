import {
  CourseStatus,
  CourseType,
  HighestEducation,
  JobApplicationStatus,
  Language,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/validation';
import { z } from 'zod';

export const QueryPartnerCourseSchema = z.object({
  status: z.nativeEnum(CourseStatus).optional(),
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  type: z.nativeEnum(CourseType).optional(),
  location: z.string().optional(),
  partnerId: z.string().optional(),
  search: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  customDate: zDateOptional,
  customerYear: zYearOptional,
});

export class QueryPartnerCourseDto extends createZodDto(
  QueryPartnerCourseSchema,
) {}
