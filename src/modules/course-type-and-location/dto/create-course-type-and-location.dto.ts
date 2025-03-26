import { CoursePlatform, CourseType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CourseTypeSchema = z.nativeEnum(CourseType);
export const CoursePlatformSchema = z.nativeEnum(CoursePlatform).optional();

export const CreateCourseTypeAndLocationSchema = z.object({
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  address: z.string().optional(),
  courseType: CourseTypeSchema,
  platform: CoursePlatformSchema,
  link: z.string().optional(),
  userId: z.string(),
});

export class CreateCourseTypeAndLocationDto extends createZodDto(
  CreateCourseTypeAndLocationSchema,
) {}
