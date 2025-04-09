import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/utils/validation';
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

export class QuerySaveCourseDto extends createZodDto(QuerySaveCourseSchema) {
  @ApiPropertyOptional({ type: String, description: 'Search term for courses' })
  search?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
  })
  limit?: number;

  @ApiPropertyOptional({ type: String, description: 'Filter by location' })
  location?: string;

  @ApiPropertyOptional({
    enum: CourseType,
    description: 'Filter by course type',
  })
  type?: CourseType;

  @ApiPropertyOptional({
    type: String,
    description: 'Custom date filter (ISO format)',
  })
  customDate?: any;

  @ApiPropertyOptional({
    type: Number,
    description: 'Custom year filter (e.g., 2024)',
  })
  customerYear?: number;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'desc',
    description: 'Sort order',
  })
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    enum: ['createdAt', 'updatedAt', 'order', 'status'],
    default: 'createdAt',
    description: 'Field to sort by',
  })
  sort?: 'createdAt' | 'updatedAt' | 'order' | 'status';
}
