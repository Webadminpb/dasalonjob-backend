import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JobOfferStatus } from '@prisma/client';

const jobOfferToSavedApplicantSchema = z.object({
  applicantId: z.string(),
  jobPostId: z.string(),
  status: z.nativeEnum(JobOfferStatus).optional(),
});

export class CreateJobOfferToSavedApplicantDto extends createZodDto(
  jobOfferToSavedApplicantSchema,
) {}

export class UpdateJobOfferToSavedApplicantDto extends createZodDto(
  jobOfferToSavedApplicantSchema.partial(),
) {}
