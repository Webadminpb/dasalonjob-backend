import { createZodDto } from 'nestjs-zod';
import { SalonDetailsSchema } from './create-salondetail.dto';

export class UpdateSalonDetailDto extends createZodDto(
  SalonDetailsSchema.partial(),
) {}
