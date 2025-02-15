import {
  JobBasicInfoProfileType,
  JobPostStatus,
  JobProfile,
  JobType,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryJobPostSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  job_profile: z.nativeEnum(JobBasicInfoProfileType).optional(),
  job_type: z.nativeEnum(JobType).optional(),
  status: z.nativeEnum(JobPostStatus).optional(),
  //   order: z.enum(['asc', 'desc']).default('desc'),
  //   sort: z
  //     .enum(['createdAt', 'updatedAt', 'order', 'status'])
  //     .default('createdAt'),
});

export class QueryJobPostDto extends createZodDto(QueryJobPostSchema) {}
