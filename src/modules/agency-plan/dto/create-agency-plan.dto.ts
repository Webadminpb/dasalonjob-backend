import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AgencyPlanSchema = z.object({
  plan: z.nativeEnum(Plan),
});

export class CreateAgencyPlanDto extends createZodDto(AgencyPlanSchema) {
  @ApiProperty({
    description: 'Subscription plan for the agency',
    enum: Plan,
    example: Plan.ONE_MONTH,
    type: String,
  })
  plan: Plan;
}
