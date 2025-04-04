import { createZodDto } from 'nestjs-zod';
import { CreateSpendCreditSchema } from './create-credit.dto';

export class UpdateSpendCreditDto extends createZodDto(
  CreateSpendCreditSchema.partial(),
) {}
