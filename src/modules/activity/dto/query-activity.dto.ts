import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  AccountStatus,
  HighestEducation,
  JobBasicInfoProfileType,
  JobPostStatus,
  JobType,
  Role,
  UserExperience,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/validation';
import { Education } from 'src/modules/education/entities/education.entity';
import { z } from 'zod';

export const QueryActivitySchema = z.object({
  lastFetchedDate: zDateOptional,
  userId: z.string(),
});

export class QueryActivityDto extends createZodDto(QueryActivitySchema) {}
