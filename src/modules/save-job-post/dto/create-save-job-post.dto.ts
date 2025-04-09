import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateSaveJobPostSchema = z.object({
  jobPostId: z.string(),
});

export class CreateASaveJobPostDto extends createZodDto(
  CreateSaveJobPostSchema,
) {
  @ApiProperty({ type: String, description: 'ID of the job post to save' })
  jobPostId: string;
}
