import { ApiPropertyOptional } from '@nestjs/swagger';
import { HighestEducation, JobApplicationStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const QueryExperienceSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  userId: z.string().optional(),
});

export class QueryExperienceDto extends createZodDto(QueryExperienceSchema) {}
