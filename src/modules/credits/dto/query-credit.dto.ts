import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const QueryCreditSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  search: z.string().optional(),
  userId: z.string().optional(),
  dateRange: z.string().optional(),
});

export class QueryCreditbDto extends createZodDto(QueryCreditSchema) {}
