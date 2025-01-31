import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { zDateOptional } from 'src/common/validation';
import { HighestEducation } from '@prisma/client';

export const createEducationSchema = z.object({
  school: z.string(),
  attended: zDateOptional,
  graduated: zDateOptional,
  education: z.nativeEnum(HighestEducation),
  isEducation: z.boolean().optional(),
});

export class CreateEducationDto extends createZodDto(createEducationSchema) {}
