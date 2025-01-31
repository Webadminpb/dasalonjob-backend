import { Gender, MartialStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { z } from 'zod';

export const createBasicDetailsSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  gender: z.nativeEnum(Gender),
  dob: zDateOptional,
  martialStatus: z.nativeEnum(MartialStatus),
  fileId: z.string().optional(),
});

export class CreateBasicdetailDto extends createZodDto(
  createBasicDetailsSchema,
) {}
