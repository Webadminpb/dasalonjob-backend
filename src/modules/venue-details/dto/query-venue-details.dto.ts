import { Gender } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional, zYearOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const QueryVenueDetailsSchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  search: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  date: zDateOptional,
  year: zYearOptional,
});

export class QueryVenueDetailsDto extends createZodDto(
  QueryVenueDetailsSchema,
) {}
