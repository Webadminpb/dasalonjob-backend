import { AccountStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateAccountStatusSchema = z.object({
  status: z.nativeEnum(AccountStatus).optional(),
});

export class UpdateAccountStatusDto extends createZodDto(
  updateAccountStatusSchema,
) {}
