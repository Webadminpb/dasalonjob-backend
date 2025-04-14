import { ApiProperty } from '@nestjs/swagger';
import { DeletionReason, Role } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createDeletionReasonSchema = z.object({
  reason: z.nativeEnum(DeletionReason).optional(),
  other: z.string().optional(),
});

export class CreateDeletionReasonDto extends createZodDto(
  createDeletionReasonSchema,
) {
  @ApiProperty({
    type: String,
    description: 'reason (optional)',
  })
  reason?: DeletionReason;

  @ApiProperty({
    type: String,
    description: 'Other reason (optional)',
  })
  other?: string;
}
