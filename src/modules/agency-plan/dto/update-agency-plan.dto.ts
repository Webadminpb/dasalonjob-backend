import { createZodDto } from 'nestjs-zod';
import { AgencyPlanSchema } from './create-agency-plan.dto';

export class UpdateAgencyPlanDto extends createZodDto(
  AgencyPlanSchema.partial(),
) {}
