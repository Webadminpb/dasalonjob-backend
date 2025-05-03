import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createAdminAuthSchema = z.object({
  users: z.array(
    z.object({
      email: z.string().email(),
      role: z.nativeEnum(Role),
      phone: z.string().min(10),
      phoneCode: z.string().optional(),
    }),
  ),
});

const createAgencyTeamMemberSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.enum(['STAFF', 'MANAGER']),
  gender: z.nativeEnum(Gender),
  phone: z.string().min(10),
  phoneCode: z.string().optional(),
});
class AdminUser {
  @ApiProperty({ example: 'admin@example.com' })
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ example: '9817119460', minLength: 10 })
  phone: string;

  @ApiProperty({ example: '+91', required: false })
  phoneCode?: string;
}
export class CreateAdminAuthDto extends createZodDto(createAdminAuthSchema) {
  @ApiProperty({
    type: [AdminUser],
    description:
      'Array of users to be created with email, role, and phone details',
  })
  users: AdminUser[];
}

export class CreateAgencyTeamMemberDto extends createZodDto(
  createAgencyTeamMemberSchema,
) {}
