import { createZodDto } from 'nestjs-zod';
import { CreateWhatsAppGroupSchema } from './create-whatsapp-group.dto';

export class UpdateWhatsappGroupDto extends createZodDto(
  CreateWhatsAppGroupSchema.partial(),
) {}
