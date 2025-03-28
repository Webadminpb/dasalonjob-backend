import { Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAdminAuthSchema = z.object({
  users: z.array(
    z.object({
      email: z.string().email(),
      role: z.nativeEnum(Role),
      phone: z.string().min(10),
    }),
  ),
});

export class CreateAdminAuthDto extends createZodDto(createAdminAuthSchema) {}
