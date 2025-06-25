import { createZodDto } from 'nestjs-zod';
import { createBusinessTypeSchema } from './create-business-type.dto';

export class UpdateBusinessTypeDto extends createZodDto(
  createBusinessTypeSchema.partial(),
) {}
