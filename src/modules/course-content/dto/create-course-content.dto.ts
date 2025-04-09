import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { HighestEducation } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ContentSchema = z.object({
  service: z.nativeEnum(HighestEducation),
  // list: z.array(z.string()),
});

export const CreateCourseContentSchema = z.object({
  content: z.array(ContentSchema),
  description: z.string().optional(),
  userId: z.string().optional(),
});

export class CreateCourseContentDto extends createZodDto(
  CreateCourseContentSchema,
) {
  @ApiProperty({
    description: 'Array of content items with education service',
    isArray: true,
    type: 'object',
    example: [
      {
        service: 'GRADUATE',
      },
    ],
  })
  content: {
    service: HighestEducation;
    // list?: string[]; // Add this if you uncomment the list in schema
  }[];

  @ApiPropertyOptional({
    description: 'Description of the course content',
    example: 'Detailed modules for beginner level JavaScript',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the user creating the content',
    example: 'user-uuid-1234',
  })
  userId?: string;
}
