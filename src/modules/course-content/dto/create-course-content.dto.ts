import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { HighestEducation } from '@prisma/client';

const ContentSchema = z.object({
  service: z.nativeEnum(HighestEducation),
  // list: z.array(z.string()),
});

export const CreateCourseContentSchema = z.object({
  content: z.array(ContentSchema),
  description: z.string().optional(),
  userId: z.string(),
});

export class CreateCourseContentDto extends createZodDto(
  CreateCourseContentSchema,
) {}
