import { createZodDto } from 'nestjs-zod';
import { JobBasicInfoSchema } from './create-job-basic-info.dto';

export class UpdateJobBasicInfoDto extends createZodDto(
  JobBasicInfoSchema.partial(),
) {}
