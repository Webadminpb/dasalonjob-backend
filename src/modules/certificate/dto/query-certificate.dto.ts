import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryCertificateSchema = z.object({
  page: z.string().optional().transform(Number).optional(),
  limit: z.string().optional().transform(Number).optional(),
  userId: z.string().optional(),
});

export class QueryCertificateDto extends createZodDto(QueryCertificateSchema) {}
