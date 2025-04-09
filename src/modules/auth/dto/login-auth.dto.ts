import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export class LoginAuthDto extends createZodDto(loginAuthSchema) {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'securePassword123', minLength: 8 })
  password: string;
}
