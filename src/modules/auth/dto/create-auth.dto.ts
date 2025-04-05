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

export class CreateAuthDto extends createZodDto(createAuthSchema) {}
