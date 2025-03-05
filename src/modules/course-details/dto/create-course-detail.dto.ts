import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JobProfile } from '@prisma/client';

export const CreateCourseDetailsSchema = z.object({
  jobProfile: z.nativeEnum(JobProfile),
  courseName: z.string(),
  courseType: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  price: z.number(),
  offerPrice: z.number(),
  isPlacement: z.boolean().optional(),
  providerId: z.string(),
  fileId: z.string().optional(),
  userId: z.string(),
});

export class CreateCourseDetailsDto extends createZodDto(
  CreateCourseDetailsSchema,
) {}
