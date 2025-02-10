import { createZodDto } from 'nestjs-zod';
import { AgencyJobBenefitsSchema } from './create-agency-job-benefit.dto';

export class UpdateAgencyJobBenefitsDto extends createZodDto(
  AgencyJobBenefitsSchema.partial(),
) {}
