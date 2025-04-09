import { ApiPropertyOptional } from '@nestjs/swagger';
import { CourseType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const QueryCourseApplicationSchema = z.object({
  status: z.nativeEnum(CourseType).optional(),
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  search: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  courseId: z.string().optional(),
  partnerId: z.string().optional(),
  location: z.string().optional(),
  languageId: z.string().optional(),
  customDate: zDateOptional,
  customerYear: zYearOptional,
});

export class QueryCourseApplicationDto extends createZodDto(
  QueryCourseApplicationSchema,
) {
  @ApiPropertyOptional({ example: 'ONLINE', enum: CourseType })
  status?: CourseType;

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  limit?: number;

  @ApiPropertyOptional({ example: 'JavaScript' })
  search?: string;

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'status'],
  })
  sort?: 'createdAt' | 'updatedAt' | 'status';

  @ApiPropertyOptional({ example: 'course-uuid-1234' })
  courseId?: string;

  @ApiPropertyOptional({ example: 'partner-uuid-5678' })
  partnerId?: string;

  @ApiPropertyOptional({ example: 'Delhi' })
  location?: string;

  @ApiPropertyOptional({ example: 'lang-uuid-9988' })
  languageId?: string;

  @ApiPropertyOptional({ example: '2024-07-01' })
  customDate?: Date;

  @ApiPropertyOptional({ example: 2025 })
  customerYear?: number;
}
