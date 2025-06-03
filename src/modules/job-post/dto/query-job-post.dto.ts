import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  JobBasicInfoProfileType,
  JobPostStatus,
  JobType,
  UserExperience,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const QueryJobPostSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  // job_profile: z.array(z.nativeEnum(JobBasicInfoProfileType)).optional(),
  job_profile: z.nativeEnum(JobBasicInfoProfileType).optional(),
  skillIds: z
  .string()
  .optional()
  .transform((val) => val?.split('_').filter(Boolean) ?? []),
  job_type: z.array(z.nativeEnum(JobType)).optional(),
  status: z.nativeEnum(JobPostStatus).optional(),
  countryId: z.string().optional(),
  minSalary: z.string().transform(Number).optional(),
  maxSalary: z.string().transform(Number).optional(),
  experience: z.nativeEnum(UserExperience).optional(),
  locations: z.array(z.string()).optional(),
  date: zDateOptional,
  partnerId: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z
    .enum(['createdAt', 'updatedAt', 'order', 'status'])
    .default('createdAt'),
});

export const QueryJobPostSchemaForAdmin = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  job_profile: z.array(z.nativeEnum(JobBasicInfoProfileType)).optional(),
  skillIds: z
  .string()
  .optional()
  .transform((val) => val?.split('_').filter(Boolean) ?? []),
  // job_profile: z.nativeEnum(JobBasicInfoProfileType).optional(),
  job_type: z.array(z.nativeEnum(JobType)).optional(),
  status: z.nativeEnum(JobPostStatus).optional(),
  countryId: z.string().optional(),
  minSalary: z.string().transform(Number).optional(),
  maxSalary: z.string().transform(Number).optional(),
  experience: z.nativeEnum(UserExperience).optional(),
  locations: z.array(z.string()).optional(),
  date: zDateOptional,
  partnerId: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z
    .enum(['createdAt', 'updatedAt', 'order', 'status'])
    .default('createdAt'),
});

export class QueryJobPostDto extends createZodDto(QueryJobPostSchema) {
  @ApiPropertyOptional({ type: String, description: 'Search query' })
  search?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of records per page',
  })
  limit?: number;

  @ApiPropertyOptional({
    enum: JobBasicInfoProfileType,
    description: 'Filter by job profile type',
  })
  job_profile?: JobBasicInfoProfileType;

  @ApiPropertyOptional({
    enum: JobType,
    description: 'Filter by job type',
  })
  job_type?: JobType[];

  @ApiPropertyOptional({
    enum: JobPostStatus,
    description: 'Filter by job post status',
  })
  status?: JobPostStatus;

  @ApiPropertyOptional({ type: String, description: 'Filter by country ID' })
  countryId?: string;

  @ApiPropertyOptional({ type: Number, description: 'Minimum Salary' })
  minSalary?: number;

  @ApiPropertyOptional({ type: Number, description: 'Maximum Salary' })
  maxSalary?: number;
}
export class QueryJobPostDtoForAdmin extends createZodDto(
  QueryJobPostSchemaForAdmin,
) {
  @ApiPropertyOptional({ type: String, description: 'Search query' })
  search?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of records per page',
  })
  limit?: number;

  @ApiPropertyOptional({
    enum: JobBasicInfoProfileType,
    description: 'Filter by job profile type',
  })
  job_profile?: JobBasicInfoProfileType[];

  @ApiPropertyOptional({
    enum: JobType,
    description: 'Filter by job type',
  })
  job_type?: JobType[];

  @ApiPropertyOptional({
    enum: JobPostStatus,
    description: 'Filter by job post status',
  })
  status?: JobPostStatus;

  @ApiPropertyOptional({ type: String, description: 'Filter by country ID' })
  countryId?: string;

  @ApiPropertyOptional({ type: Number, description: 'Minimum Salary' })
  minSalary?: number;

  @ApiPropertyOptional({ type: Number, description: 'Maximum Salary' })
  maxSalary?: number;
}
