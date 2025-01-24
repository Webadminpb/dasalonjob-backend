import { Role } from "./auth.schema";
import { z } from "zod";




const CreateAuthDto = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.nativeEnum(Role),
    phone: z.string().min(10),
    isPhoneVerified: z.boolean().default(false),
    isEmailVerified: z.boolean().default(false),
    phoneVerificationCode: z.string(),
    emailVerificationCode: z.string(),
    phoneVerificationCodeExpiry: z.date(),
    emailVerificationCodeExpiry: z.date(),
})

export type CreateAuthDto = z.infer<typeof CreateAuthDto>;