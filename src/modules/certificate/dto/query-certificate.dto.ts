import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryCertificateSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  userId: z.string().optional(),
});

export class QueryCertificateDto extends createZodDto(QueryCertificateSchema) {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  limit?: number;

  @ApiPropertyOptional({
    example: 'user-uuid-1234',
    description: 'User ID to filter certificates',
  })
  userId?: string;
}
