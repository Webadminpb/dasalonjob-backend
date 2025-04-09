import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createPlanSchema = z.object({
  name: z.string(),
  durationInDays: z.number(),
  price: z.number(),
  currency: z.string(),
  isActive: z.boolean().optional(),
});

const queryPlanSchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  search: z.string().optional(),
  isActive: z.string().optional().transform(Boolean),
});

export class CreatePlanDto extends createZodDto(createPlanSchema) {}
export class UpdatePlanDto extends createZodDto(createPlanSchema.partial()) {}
export class QueryPlanDto extends createZodDto(queryPlanSchema) {}
