import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateSavedApplicantSchema = z.object({
  applicantId: z.string(),
  categoryId: z.string(),
});

export class CreateSavedApplicantDto extends createZodDto(
  CreateSavedApplicantSchema,
) {}

export class UpdateSavedApplicantDto extends createZodDto(
  CreateSavedApplicantSchema.partial(),
) {}
