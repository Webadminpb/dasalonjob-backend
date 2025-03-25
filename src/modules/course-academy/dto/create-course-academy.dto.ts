import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCourseAcademySchema = z.object({
  providerId: z.string().optional(),
});

export class CreateCourseAcademyDto extends createZodDto(
  CreateCourseAcademySchema,
) {}
