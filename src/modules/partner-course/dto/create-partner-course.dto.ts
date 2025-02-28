import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CourseStatus } from '@prisma/client';

export const CreatePartnerCourseSchema = z.object({
  courseDetailsId: z.string(),
  courseContentId: z.string(),
  courseAcademyId: z.string(),
  courseTypeAndLocationId: z.string(),
  status: z.nativeEnum(CourseStatus).optional(),
  isOpen: z.boolean().optional(),
});

export class CreatePartnerCourseDto extends createZodDto(
  CreatePartnerCourseSchema,
) {}
