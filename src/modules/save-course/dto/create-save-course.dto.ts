import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateSaveCourseSchema = z.object({
  courseId: z.string(),
});

export class CreateSaveCourseDto extends createZodDto(CreateSaveCourseSchema) {
  @ApiProperty({
    type: String,
    example: 'course_abc123',
    description: 'The ID of the course to be saved by the user',
  })
  courseId: string;
}
