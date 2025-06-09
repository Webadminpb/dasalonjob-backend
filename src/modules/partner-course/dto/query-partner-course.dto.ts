import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseStatus, CourseType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const QueryPartnerCourseSchema = z.object({
  status: z.nativeEnum(CourseStatus).optional(),
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  type: z.nativeEnum(CourseType).optional(),
  locations: z.string().optional(),
  partnerId: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  skillIds: z.string().optional(),
  search: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  customDate: zDateOptional,
  customerYear: zYearOptional,
});

export class QueryPartnerCourseDto extends createZodDto(
  QueryPartnerCourseSchema,
) {
  @ApiPropertyOptional({
    enum: CourseStatus,
    description: 'Status of the course',
  })
  status?: CourseStatus;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results per page',
  })
  limit?: number;

  @ApiPropertyOptional({ enum: CourseType, description: 'Type of course' })
  type?: CourseType;

  @ApiPropertyOptional({
    example: 'Delhi',
    description: 'Location of the course',
  })
  location?: string;

  @ApiPropertyOptional({ example: 'partner_123', description: 'Partner ID' })
  partnerId?: string;

  @ApiPropertyOptional({ example: 'javascript', description: 'Search query' })
  search?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'desc',
    description: 'Sorting order',
  })
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    enum: ['createdAt', 'updatedAt', 'status'],
    default: 'createdAt',
    description: 'Field to sort by',
  })
  sort?: 'createdAt' | 'updatedAt' | 'status';

  @ApiPropertyOptional({
    type: String,
    description: 'Custom date filter (ISO format)',
  })
  customDate?: Date;

  @ApiPropertyOptional({
    type: Number,
    description: 'Custom year filter (4-digit year)',
  })
  customerYear?: number;
}
