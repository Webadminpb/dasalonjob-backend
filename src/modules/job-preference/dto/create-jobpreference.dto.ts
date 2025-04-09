import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { JoiningAvailability } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const SalaryRangeSchema = z.object({
  start: z.number().default(0),
  end: z.number().default(0),
});

export const createJobPreferenceSchema = z.object({
  locations: z.array(z.string()),
  joining: z.nativeEnum(JoiningAvailability),
  salary: SalaryRangeSchema,
  skillsIds: z.array(z.string()).optional(),
});

export class CreateJobpreferenceDto extends createZodDto(
  createJobPreferenceSchema,
) {
  @ApiProperty({
    type: [String],
    example: ['Bangalore', 'Delhi'],
    description: 'Preferred job locations',
  })
  locations: string[];

  @ApiProperty({
    enum: JoiningAvailability,
    example: JoiningAvailability.AnyTime,
    description: 'Joining availability status',
  })
  joining: JoiningAvailability;

  @ApiProperty({
    example: { start: 500000, end: 900000 },
    description: 'Expected salary range in INR',
  })
  salary: {
    start: number;
    end: number;
  };

  @ApiPropertyOptional({
    type: [String],
    example: ['skillId1', 'skillId2'],
    description: 'Optional list of skill IDs',
  })
  skillsIds?: string[];
}
