import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryExperienceSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  userId: z.string().optional(),
});

export class QueryExperienceDto extends createZodDto(QueryExperienceSchema) {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  limit?: number;

  @ApiPropertyOptional({
    example: 'user_abc123',
    description: 'Filter by user ID',
  })
  userId?: string;
}
