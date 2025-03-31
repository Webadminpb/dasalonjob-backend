import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Role } from '@prisma/client';

export const AgencyTeamMemberSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  role: z
    .nativeEnum(Role)
    .refine(
      (role) => ['STAFF', 'MANAGER'].includes(role),
      'Role must be either STAFF or MANAGER',
    ),
  //   permissions: z.array(z.string()).optional(),
});

export class CreateAgencyTeamMemberDto extends createZodDto(
  AgencyTeamMemberSchema,
) {}
