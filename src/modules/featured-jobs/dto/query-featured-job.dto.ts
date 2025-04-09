import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryFeaturedJobSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  jobPostId: z.string().optional(),
  adminId: z.string().optional(),
  sort: z.string().optional(),
});

export class QueryFeaturedJobDto extends createZodDto(QueryFeaturedJobSchema) {
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  limit?: number;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'job_123456' })
  jobPostId?: string;

  @ApiPropertyOptional({ example: 'admin_789' })
  adminId?: string;

  @ApiPropertyOptional({
    example: 'priority',
    enum: ['endDate', 'priority', 'createdAt'],
  })
  sort?: string;
}
