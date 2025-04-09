import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
  phone: z.string().min(10),
  phoneCode: z.string().optional(),
  countryId: z.string().optional(),
  isPhoneVerified: z.boolean().default(false),
  isEmailVerified: z.boolean().default(false),
  phoneVerificationCode: z.string().optional(),
  emailVerificationCode: z.string().optional(),
  phoneVerificationCodeExpiry: z.date().optional(),
  emailVerificationCodeExpiry: z.date().optional(),
});

export class CreateAuthDto extends createZodDto(createAuthSchema) {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 8 })
  password: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  role: Role;

  @ApiProperty({ example: '9876543210', minLength: 10 })
  phone: string;

  @ApiPropertyOptional({ example: '+91' })
  phoneCode?: string;

  @ApiPropertyOptional({ example: 'country-id-123' })
  countryId?: string;

  @ApiProperty({ example: false, default: false })
  isPhoneVerified: boolean;

  @ApiProperty({ example: false, default: false })
  isEmailVerified: boolean;

  @ApiPropertyOptional({ example: '123456' })
  phoneVerificationCode?: string;

  @ApiPropertyOptional({ example: 'abcxyz' })
  emailVerificationCode?: string;

  @ApiPropertyOptional({ example: new Date().toISOString() })
  phoneVerificationCodeExpiry?: Date;

  @ApiPropertyOptional({ example: new Date().toISOString() })
  emailVerificationCodeExpiry?: Date;
}
