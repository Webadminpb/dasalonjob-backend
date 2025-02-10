import { AgencyJobQualificationSchema } from './create-agency-job-qualification.dto';
import { createZodDto } from 'nestjs-zod';

export class UpdateAgencyJobQualificationDto extends createZodDto(
  AgencyJobQualificationSchema.partial(),
) {}
