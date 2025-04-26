import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createSavedApplicantCategorySchema = z.object({
  name: z.string(),
});

export class CreateSavedApplicantCategoryDto extends createZodDto(
  createSavedApplicantCategorySchema,
) {}

export class UpdateSavedApplicantCategoryDto extends createZodDto(
  createSavedApplicantCategorySchema.partial(),
) {}
