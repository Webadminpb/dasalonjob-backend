import { createZodDto } from 'nestjs-zod';
import { createContactDetailsSchema } from './create-contactdetail.dto';

export class UpdateContactdetailDto extends createZodDto(
  createContactDetailsSchema.partial(),
) {}
