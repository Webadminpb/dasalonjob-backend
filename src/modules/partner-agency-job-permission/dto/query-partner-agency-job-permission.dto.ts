import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryPartnerAgencyPermissionSchema = z.object({
  partnerId: z.string().optional(),
  agencyId: z.string().optional(),
  hasAccess: z.boolean().optional(),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
});

export class QueryPartnerAgencyPermissionDto extends createZodDto(
  QueryPartnerAgencyPermissionSchema,
) {
  @ApiPropertyOptional({
    example: 'partner_abc123',
    description: 'Filter by partner ID',
  })
  partnerId?: string;

  @ApiPropertyOptional({
    example: 'agency_xyz456',
    description: 'Filter by agency ID',
  })
  agencyId?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by access status',
  })
  hasAccess?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Limit of items per page' })
  limit?: number;

  @ApiPropertyOptional({
    example: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt'],
    description: 'Field to sort by',
  })
  sort?: 'createdAt' | 'updatedAt';
}
