import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createPastWorkSchema = z.object({
  videoLink: z.array(z.string()),
  fileIds: z.array(z.string()),
});

export class CreatePastworkDto extends createZodDto(createPastWorkSchema) {
  @ApiProperty({
    type: [String],
    example: ['https://youtu.be/example1', 'https://youtu.be/example2'],
    description: 'Array of video links demonstrating past work',
  })
  videoLink: string[];

  @ApiProperty({
    type: [String],
    example: ['file_abc123', 'file_def456'],
    description: 'Array of file IDs uploaded as past work',
  })
  fileIds: string[];
}
