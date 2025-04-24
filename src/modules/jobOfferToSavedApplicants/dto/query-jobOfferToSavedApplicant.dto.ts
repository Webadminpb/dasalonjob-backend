import { JobOfferStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const queryJobOfferToSavedApplicantSchema = z.object({
  search: z.string().optional(),
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  status: z.nativeEnum(JobOfferStatus).optional(),
});

export class QueryJobOfferToSavedApplicantDto extends createZodDto(
  queryJobOfferToSavedApplicantSchema,
) {}
