import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAuthFileSchema = z.object({
  profileImageId: z.string().optional(),
  verificationFileId: z.array(z.string()).optional(),
});

export class CreateAuthFileDto extends createZodDto(createAuthFileSchema) {
  @ApiPropertyOptional({
    example: 'profile-img-id-123',
    description: 'File ID for the user profile image',
  })
  profileImageId?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['file-id-1', 'file-id-2'],
    description: 'Array of file IDs used for verification purposes',
  })
  verificationFileId?: string[];
}
