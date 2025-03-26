import { JobPostStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CourseStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(JobPostStatus),
});

export class CreateCourseStatusDto extends createZodDto(CourseStatusSchema) {}
