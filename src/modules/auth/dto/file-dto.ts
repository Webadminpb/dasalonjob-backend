import { Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAuthFileSchema = z.object({
  profileImageId: z.string().optional(),
  verificationFileId: z.array(z.string()).optional(),
});

export class CreateAuthFileDto extends createZodDto(createAuthFileSchema) {}
