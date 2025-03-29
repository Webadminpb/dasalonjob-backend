import { ApiPropertyOptional } from '@nestjs/swagger';
import { HighestEducation, JobApplicationStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { z } from 'zod';

export const QueryJobApplicationSchema = z.object({
  status: z.nativeEnum(JobApplicationStatus).optional(),
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  location: z.string().optional(),
  jobPostId: z.string().optional(),
  partnerId: z.string().optional(),
  languageId: z.string().optional(),
  education: z.nativeEnum(HighestEducation).optional(),
  skillId: z.string().optional(),
  isTrained: z.boolean().optional(),
  search: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  customDate: zDateOptional,
  customerYear: zDateOptional,
});

export class QueryJobApplicationDto extends createZodDto(
  QueryJobApplicationSchema,
) {
  @ApiPropertyOptional({
    enum: JobApplicationStatus,
    description: 'Filter by job application status',
  })
  status?: JobApplicationStatus;

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

  @ApiPropertyOptional({ type: String, description: 'Filter by location' })
  location?: string;

  // @ApiPropertyOptional({
  //   enum: Language,
  //   description: 'Filter by language proficiency',
  // })
  // language?: Language;

  @ApiPropertyOptional({
    enum: HighestEducation,
    description: 'Filter by highest education level',
  })
  education?: HighestEducation;

  @ApiPropertyOptional({ type: String, description: 'Filter by skills' })
  skills?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by training status',
  })
  isTrained?: boolean;

  @ApiPropertyOptional({ type: String, description: 'Search query' })
  search?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Sorting order',
    default: 'desc',
  })
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    enum: ['createdAt', 'updatedAt', 'status'],
    description: 'Sort by field',
    default: 'createdAt',
  })
  sort?: 'createdAt' | 'updatedAt' | 'status';

  @ApiPropertyOptional({ type: String, description: 'Custom date filter' })
  customDate?: Date;

  @ApiPropertyOptional({ type: String, description: 'Customer year filter' })
  customerYear?: Date;
}
