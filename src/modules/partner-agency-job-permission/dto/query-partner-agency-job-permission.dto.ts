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
) {}
