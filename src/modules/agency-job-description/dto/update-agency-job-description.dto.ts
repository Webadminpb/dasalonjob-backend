import { AgencyJobDescriptionSchema } from './create-agency-job-description.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateAgencyJobDescriptionDto extends createZodDto(
  AgencyJobDescriptionSchema.partial(),
) {}
