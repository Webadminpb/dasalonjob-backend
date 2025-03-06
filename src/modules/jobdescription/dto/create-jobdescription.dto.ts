import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const JobDescriptionSchema = z.object({
  description: z.string(),
});

export class CreateJobDescriptionDto extends createZodDto(
  JobDescriptionSchema,
) {
  @ApiProperty({
    example: 'Responsible for developing and maintaining backend services.',
  })
  description: string;
}
