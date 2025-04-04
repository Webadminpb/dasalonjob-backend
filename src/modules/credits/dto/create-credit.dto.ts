import { CreditType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateSpendCreditSchema = z.object({
  creditType: z.nativeEnum(CreditType),
  applicationData: z.object({
    jobApplicationId: z.string().optional(),
    courseApplicationId: z.string().optional(),
  }),
});

export class CreateSpendCreditDto extends createZodDto(
  CreateSpendCreditSchema,
) {}
