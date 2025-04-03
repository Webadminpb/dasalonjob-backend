import { createZodDto } from 'nestjs-zod';
import { FeaturedJobSchema } from './create-featured-job.dto';

export class UpdateFeaturedJobDto extends createZodDto(
  FeaturedJobSchema.partial(),
) {}
