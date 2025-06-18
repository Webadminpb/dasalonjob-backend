import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  AccountStatus,
  BusinessType,
  HighestEducation,
  Role,
  UserExperience,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const QueryAuthSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  skillId: z.string().optional(),
  skillIds: z.string().optional(),
  education: z.nativeEnum(HighestEducation).optional(),
  status: z.nativeEnum(AccountStatus).optional(),
  locations: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  countryId: z.string().optional(),
  date: zDateOptional.optional(),
  year: zYearOptional.optional(),
  experience: z.nativeEnum(UserExperience).optional(),
  businessType: z.nativeEnum(BusinessType).optional(),

  order: z.enum(['asc', 'desc']).default('desc'),
  sort: z
    .enum(['createdAt', 'updatedAt', 'order', 'status'])
    .default('createdAt'),
});

export class QueryAuthDto extends createZodDto(QueryAuthSchema) {
  @ApiPropertyOptional({ example: 'john', description: 'Search keyword' })
  search?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of items per page' })
  limit?: number;

  @ApiPropertyOptional({
    example: 'skill-id-123',
    description: 'Skill ID to filter by',
  })
  skillId?: string;

  @ApiPropertyOptional({
    enum: HighestEducation,
    example: HighestEducation.Certificate,
  })
  education?: HighestEducation;

  @ApiPropertyOptional({ enum: AccountStatus, example: AccountStatus.ACTIVE })
  status?: AccountStatus;

  @ApiPropertyOptional({
    example: 'Delhi,Mumbai',
    description: 'Comma-separated locations',
  })
  locations?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.USER })
  role?: Role;

  @ApiPropertyOptional({ example: 'country-id-123', description: 'Country ID' })
  countryId?: string;

  @ApiPropertyOptional({
    example: '2024-08-01',
    description: 'Date filter (YYYY-MM-DD)',
  })
  date?: Date;

  @ApiPropertyOptional({ example: 2023, description: 'Year filter (YYYY)' })
  year?: number;

  @ApiPropertyOptional({
    enum: BusinessType,
    example: BusinessType.AesthethicAndMedicalClinic,
  })
  businessType?: BusinessType;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'desc' })
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    enum: ['createdAt', 'updatedAt', 'order', 'status'],
    example: 'createdAt',
  })
  sort?: 'createdAt' | 'updatedAt' | 'order' | 'status';
}
