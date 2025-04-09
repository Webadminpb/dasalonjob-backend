import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  userId: z.string().optional(),
});

export class CreateCourseTypeAndLocationDto extends createZodDto(
  CreateCourseTypeAndLocationSchema,
) {
  @ApiPropertyOptional({
    description: 'Country of the course location',
    example: 'India',
  })
  country?: string;

  @ApiPropertyOptional({
    description: 'City of the course location',
    example: 'Bangalore',
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'State of the course location',
    example: 'Karnataka',
  })
  state?: string;

  @ApiPropertyOptional({
    description: 'Pincode of the course location',
    example: '560001',
  })
  pincode?: string;

  @ApiPropertyOptional({
    description: 'Detailed address',
    example: 'MG Road, Bangalore',
  })
  address?: string;

  @ApiProperty({
    enum: CourseType,
    description: 'Type of the course',
    example: CourseType.Offline,
  })
  courseType: CourseType;

  @ApiPropertyOptional({
    enum: CoursePlatform,
    description: 'Platform used for the course',
    example: CoursePlatform.GoogleMeet,
  })
  platform?: CoursePlatform;

  @ApiPropertyOptional({
    description: 'Link to the course if it is online',
    example: 'https://course-platform.com/xyz',
  })
  link?: string;

  @ApiPropertyOptional({
    description: 'User ID who created the course type/location',
    example: 'user-uuid-123',
  })
  userId?: string;
}
