import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Role } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
) {
  @ApiPropertyOptional({
    description: 'Filter by team member role',
    enum: Role,
    example: 'STAFF',
  })
  role?: Role;

  @ApiPropertyOptional({
    description: 'Search term for member name or email',
    example: 'john',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: '1',
    type: String,
  })
  page?: any;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: '10',
    type: String,
  })
  limit?: any;

  @ApiPropertyOptional({
    description: 'Filter by member status',
    enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
    example: 'ACTIVE',
  })
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';

  @ApiPropertyOptional({
    description: 'Sort field',
    enum: ['createdAt', 'updatedAt', 'role'],
    default: 'createdAt',
  })
  sort?: 'createdAt' | 'updatedAt' | 'role';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  order?: 'asc' | 'desc';
}
