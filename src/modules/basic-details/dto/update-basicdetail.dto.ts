import { createBasicDetailsSchema } from './create-basicdetail.dto';

import { createZodDto } from 'nestjs-zod';

export class UpdateBasicdetailDto extends createZodDto(
  createBasicDetailsSchema.partial(),
) {}
