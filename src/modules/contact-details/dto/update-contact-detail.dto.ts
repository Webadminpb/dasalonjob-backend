import { createZodDto } from 'nestjs-zod';
import { createContactDetailsSchema } from './create-contact-detail.dto';

export class UpdateContactdetailDto extends createZodDto(
  createContactDetailsSchema.partial(),
) {}
