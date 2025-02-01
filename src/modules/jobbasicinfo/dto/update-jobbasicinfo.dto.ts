import { createZodDto } from 'nestjs-zod';
import { JobBasicInfoSchema } from './create-jobbasicinfo.dto';

export class UpdateJobBasicInfoDto extends createZodDto(
  JobBasicInfoSchema.partial(),
) {}
