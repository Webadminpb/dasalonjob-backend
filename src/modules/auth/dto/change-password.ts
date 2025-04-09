import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createChangePasswordSchema = z.object({
  email: z.string().email(),
  current_password: z.string(),
  new_password: z.string().min(8),
});

export class CreateChangePasswordDto extends createZodDto(
  createChangePasswordSchema,
) {


  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'oldPassword123' })
  current_password: string;

  @ApiProperty({ example: 'newPassword456', minLength: 8 })
  new_password: string;
}
