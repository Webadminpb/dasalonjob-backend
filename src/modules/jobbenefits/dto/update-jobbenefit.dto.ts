import { createZodDto } from 'nestjs-zod';
import { JobBenefitsSchema } from './create-jobbenefit.dto';

export class UpdateJobBenefitsDto extends createZodDto(
  JobBenefitsSchema.partial(),
) {}
