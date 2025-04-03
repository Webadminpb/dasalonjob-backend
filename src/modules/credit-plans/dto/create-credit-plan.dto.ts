import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCreditPlanSchema = z.object({
  totalJobs: z.number(),
  totalCourses: z.number(),
  price: z.number(),
  isRecommended: z.boolean().optional(),
});

export class CreateCreditPlanDto extends createZodDto(CreateCreditPlanSchema) {}
