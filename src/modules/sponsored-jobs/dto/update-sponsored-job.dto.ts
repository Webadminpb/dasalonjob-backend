import { createZodDto } from 'nestjs-zod';
import { sponsoredJobSchema } from './create-sponsored-job.dto';

export class UpdateSponsoredJobDto extends createZodDto(
  sponsoredJobSchema.partial(),
) {}
