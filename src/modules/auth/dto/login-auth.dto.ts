import { Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export class LoginAuthDto extends createZodDto(loginAuthSchema) {}
