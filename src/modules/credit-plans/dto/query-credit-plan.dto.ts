import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryCreditPlanSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
});

export class QueryCreditPlanbDto extends createZodDto(QueryCreditPlanSchema) {}
