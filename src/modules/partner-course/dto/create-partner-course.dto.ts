import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CourseStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const CreatePartnerCourseSchema = z.object({
  courseDetailsId: z.string(),
  courseContentId: z.string(),
  courseAcademyId: z.string(),
  courseTypeAndLocationId: z.string(),
  status: z.nativeEnum(CourseStatus).optional(),
  isOpen: z.boolean().optional(),
  userId: z.string().optional(),
});

export class CreatePartnerCourseDto extends createZodDto(
  CreatePartnerCourseSchema,
) {
  @ApiProperty({ example: 'cd_123', description: 'ID of the course details' })
  courseDetailsId: string;

  @ApiProperty({ example: 'cc_456', description: 'ID of the course content' })
  courseContentId: string;

  @ApiProperty({ example: 'ca_789', description: 'ID of the course academy' })
  courseAcademyId: string;

  @ApiProperty({
    example: 'ctl_101',
    description: 'ID of the course type and location',
  })
  courseTypeAndLocationId: string;

  @ApiPropertyOptional({
    enum: CourseStatus,
    example: CourseStatus.Approved,
    description: 'Current status of the course',
  })
  status?: CourseStatus;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the course is open for registration',
  })
  isOpen?: boolean;

  @ApiPropertyOptional({
    example: 'user_123',
    description: 'User ID who is creating the course',
  })
  userId?: string;
}
