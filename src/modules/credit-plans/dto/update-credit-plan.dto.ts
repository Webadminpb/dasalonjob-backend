import { createZodDto } from 'nestjs-zod';
import { CreateCreditPlanSchema } from './create-credit-plan.dto';

export class UpdateCreditPlanDto extends createZodDto(
  CreateCreditPlanSchema.partial(),
) {}
