import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Role } from '@prisma/client';

export const QueryAgencyTeamMembersSchema = z.object({
  role: z.nativeEnum(Role).optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'role']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export class QueryAgencyTeamMembersDto extends createZodDto(
  QueryAgencyTeamMembersSchema,
) {}
