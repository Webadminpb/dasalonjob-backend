import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  BusinessType,
  CollaborationInitiator,
  Gender,
  VenueStatus,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const QueryPartnerVenueSchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  search: z.string().optional(),
  userId: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  locations: z.string().optional(),
  status: z.nativeEnum(VenueStatus).optional(),
  request: z.enum(['SENT', 'INCOMING', 'APPROVED']).optional(),
  // role: z.nativeEnum(CollaborationInitiator).optional(),
  businessTypeId: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z.enum(['createdAt', 'updatedAt', 'status']).default('createdAt'),
  date: zDateOptional,
});

export class QueryPartnerVenueDto extends createZodDto(
  QueryPartnerVenueSchema,
) {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  limit?: number;

  @ApiPropertyOptional({ example: 'fitness', description: 'Search keyword' })
  search?: string;

  @ApiPropertyOptional({ example: 'user_abc123', description: 'User ID' })
  userId?: string;

  @ApiPropertyOptional({
    enum: Gender,
    description: 'Preferred gender of the venue owner',
  })
  gender?: Gender;

  @ApiPropertyOptional({
    example: '2025-04-09',
    description: 'Filter by date (YYYY-MM-DD)',
  })
  date?: Date;
}
