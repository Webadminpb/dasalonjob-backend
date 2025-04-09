import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QuerySaveJobPostSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform(Number),
  //   order: z.enum(['asc', 'desc']).default('desc'),
  //   sort: z
  //     .enum(['createdAt', 'updatedAt', 'order', 'status'])
  //     .default('createdAt'),
});

export class QuerySaveJobPostDto extends createZodDto(QuerySaveJobPostSchema) {
  @ApiPropertyOptional({ type: String, description: 'Search keyword' })
  search?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Page number for pagination',
  })
  page?: number;
}
