import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createChangePasswordSchema = z.object({
  email: z.string().email(),
  current_password: z.string(),
  new_password: z.string().min(8),
});

export class CreateChangePasswordDto extends createZodDto(
  createChangePasswordSchema,
) {}
