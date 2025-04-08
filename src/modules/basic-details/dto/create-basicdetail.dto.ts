import { Gender, MartialStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/utils/validation';
import { z } from 'zod';

export const createBasicDetailsSchema = z.object({
  // fullName: z.string().min(1, { message: 'Full name is required' }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.nativeEnum(Gender),
  dob: zDateOptional,
  martialStatus: z.nativeEnum(MartialStatus).optional(),
  fileId: z.string().optional(),
});

export class CreateBasicdetailDto extends createZodDto(
  createBasicDetailsSchema,
) {}
