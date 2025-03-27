import { createZodDto } from 'nestjs-zod';
import { JobDescriptionSchema } from './create-jobdescription.dto';

export class UpdateJobDescriptionDto extends createZodDto(
  JobDescriptionSchema.partial(),
) {}
