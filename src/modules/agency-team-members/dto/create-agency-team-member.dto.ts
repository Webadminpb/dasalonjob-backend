import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const AgencyTeamMemberSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  role: z
    .nativeEnum(Role)
    .refine(
      (role) => ['STAFF', 'MANAGER'].includes(role),
      'Role must be either STAFF or MANAGER',
    ),
});

export class CreateAgencyTeamMemberDto extends createZodDto(
  AgencyTeamMemberSchema,
) {
  @ApiProperty({
    description: 'Unique identifier of the team member',
    example: 'team-member-123',
    minLength: 1,
    required: true,
    type: String,
  })
  memberId: string;

  @ApiProperty({
    description: 'Role assigned to the team member (STAFF or MANAGER only)',
    enum: ['STAFF', 'MANAGER'],
    example: 'STAFF',
    required: true,
  })
  role: Role;
}
