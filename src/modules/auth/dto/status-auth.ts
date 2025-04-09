import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateAccountStatusSchema = z.object({
  status: z.nativeEnum(AccountStatus).optional(),
});

export class UpdateAccountStatusDto extends createZodDto(
  updateAccountStatusSchema,
) {
  @ApiPropertyOptional({
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
    description: 'Status to update the account to',
  })
  status?: AccountStatus;
}
