import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { z } from 'zod';

export const QueryWhatsAppSchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  search: z.string().optional(),
  city: z.string().optional(),
  date: zDateOptional,
});

export class QueryWhatsAppDto extends createZodDto(QueryWhatsAppSchema) {}
