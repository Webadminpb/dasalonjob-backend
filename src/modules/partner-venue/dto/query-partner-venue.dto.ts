import {
  Gender,
  JobBasicInfoProfileType,
  JobPostStatus,
  JobType,
} from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { z } from 'zod';

export const QueryPartnerVenueSchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  search: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  date: zDateOptional,
});

export class QueryPartnerVenueDto extends createZodDto(
  QueryPartnerVenueSchema,
) {}
