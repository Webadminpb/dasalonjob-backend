import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobProfile } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCourseDetailsSchema = z.object({
  jobProfile: z.nativeEnum(JobProfile),
  courseName: z.string(),
  courseType: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  price: z.number(),
  offerPrice: z.number(),
  isPlacement: z.boolean().optional(),
  provider: z.string().optional(),
  fileId: z.string().optional(),
  userId: z.string().optional(),
});

export class CreateCourseDetailsDto extends createZodDto(
  CreateCourseDetailsSchema,
) {
  @ApiProperty({
    enum: JobProfile,
    description: 'Job profile for which the course is relevant',
  })
  jobProfile: JobProfile;

  @ApiProperty({
    description: 'Name of the course',
    example: 'Full Stack Development',
  })
  courseName: string;

  @ApiPropertyOptional({ description: 'Type of course', example: 'Online' })
  courseType?: string;

  @ApiProperty({
    description: 'Start date of the course (ISO string)',
    example: '2025-04-10T10:00:00Z',
  })
  startDate: string;

  @ApiProperty({
    description: 'End date of the course (ISO string)',
    example: '2025-06-10T18:00:00Z',
  })
  endDate: string;

  @ApiProperty({ description: 'Price of the course', example: 20000 })
  price: number;

  @ApiProperty({ description: 'Offer price of the course', example: 15000 })
  offerPrice: number;

  @ApiPropertyOptional({
    description: 'Is placement assistance available?',
    example: true,
  })
  isPlacement?: boolean;

  @ApiPropertyOptional({
    description: 'Provider of the course',
    example: 'Scaler Academy',
  })
  provider?: string;

  @ApiPropertyOptional({
    description: 'File ID for course brochure/image',
    example: 'file-uuid-1234',
  })
  fileId?: string;

  @ApiPropertyOptional({
    description: 'User ID who created the course',
    example: 'user-uuid-5678',
  })
  userId?: string;
}
