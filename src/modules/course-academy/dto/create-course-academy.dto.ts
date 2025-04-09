import { ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCourseAcademySchema = z.object({
  providerId: z.string().optional(),
  userId: z.string().optional(),
});

export class CreateCourseAcademyDto extends createZodDto(
  CreateCourseAcademySchema,
) {
  @ApiPropertyOptional({
    example: 'provider-uuid-1234',
    description: 'Optional provider ID',
  })
  providerId?: string;

  @ApiPropertyOptional({
    example: 'user-uuid-5678',
    description: 'Optional user ID',
  })
  userId?: string;
}
