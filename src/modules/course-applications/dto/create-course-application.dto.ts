import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCourseApplicationSchema = z.object({
  courseId: z.string(),
});

export class CreateCourseApplicationDto extends createZodDto(
  CreateCourseApplicationSchema,
) {
  @ApiProperty({
    example: 'course-uuid-1234',
    description: 'The unique ID of the course to apply for',
  })
  courseId: string;
}
