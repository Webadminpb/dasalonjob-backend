import { z } from 'zod';

export const AuthBaseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  password: z.string(),
  role: z.string(),
  phoneCode: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  isPhoneVerified: z.boolean(),
  isEmailVerified: z.boolean(),
  phoneVerificationCode: z.string().nullable().optional(),
  emailVerificationCode: z.string().nullable().optional(),
  phoneVerificationCodeExpiry: z.date().nullable().optional(),
  emailVerificationCodeExpiry: z.date().nullable().optional(),
  isBlocked: z.boolean(),
  isVerified: z.boolean(),
  status: z.string(),

  countryId: z.string().nullable().optional(),
  profileImageId: z.string().nullable().optional(),
  verificationFileId: z.array(z.string()).optional(),

  isEducation: z.boolean().nullable().optional(),
  isProfessional: z.boolean().nullable().optional(),
  isExperience: z.boolean().nullable().optional(),
  isPartner: z.boolean().nullable().optional(),

  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export const PublicUserSchema = AuthBaseSchema.pick({
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  status: true,
  isBlocked: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  createdAt: true,
  updatedAt: true,
});
