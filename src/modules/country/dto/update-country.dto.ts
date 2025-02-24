import { createZodDto } from 'nestjs-zod';
import { CreateCountrySchema } from './create-country.dto';

export class UpdateCountryDto extends createZodDto(
  CreateCountrySchema.partial(),
) {}
