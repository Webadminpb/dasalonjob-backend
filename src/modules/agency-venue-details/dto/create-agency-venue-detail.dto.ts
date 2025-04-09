import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Gender, JobProfile, Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export const AgencyVenueDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneCode: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  gender: z.nativeEnum(Gender),
  jobRole: z.nativeEnum(JobProfile),
  fileId: z.string().optional(),
});

export class CreateAgencyVenueDetailsDto extends createZodDto(
  AgencyVenueDetailsSchema,
) {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: '+91' })
  phoneCode: string;

  @ApiProperty({ example: '9817119460' })
  phoneNumber: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ enum: JobProfile })
  jobRole: JobProfile;

  @ApiProperty({ example: 'file_xyz123', required: false })
  fileId?: string;
}
