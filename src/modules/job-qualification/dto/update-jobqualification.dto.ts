import { createZodDto } from 'nestjs-zod';
import { JobQualificationSchema } from './create-jobqualification.dto';

export class UpdateJobQualificationDto extends createZodDto(
  JobQualificationSchema.partial(),
) {}
