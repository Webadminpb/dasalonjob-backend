import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createBusinessTypeSchema = z.object({
  name: z.string(),
  fileId: z.string(),
  status: z.boolean(),
});

export class CreateBusinessTypeDto extends createZodDto(
  createBusinessTypeSchema,
) {}
