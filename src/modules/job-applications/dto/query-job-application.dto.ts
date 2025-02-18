import {
  HighestEducation,
  JobApplicationStatus,
  Language,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { Education } from 'src/modules/education/entities/education.entity';
import { z } from 'zod';

export const QueryJobApplicationSchema = z.object({
  status: z.nativeEnum(JobApplicationStatus).optional(),
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  location: z.string().optional(),
  language: z.nativeEnum(Language).optional(),
  education: z.nativeEnum(HighestEducation).optional(),
  skills: z.string().optional(),
  isTrained: z.boolean().optional(),
  search: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  customDate: z.string().optional(), // New field for custom date filter
});

export class QueryJobApplicationDto extends createZodDto(
  QueryJobApplicationSchema,
) {}
