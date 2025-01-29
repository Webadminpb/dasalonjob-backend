import { createZodDto } from 'nestjs-zod';
import { createJobPreferenceSchema } from './create-jobpreference.dto';

export class UpdateJobpreferenceDto extends createZodDto(
  createJobPreferenceSchema.partial(),
) {}
