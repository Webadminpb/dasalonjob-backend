import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createOrUpdateUserNotificationSettingSchema = z.object({
  isWhatsApp: z.boolean().optional(),
  isSystemApp: z.boolean().optional(),
  isEmail: z.boolean().optional(),
  isSMS: z.boolean().optional(),
});

export class CreateOrUpdateUserNotificationSetting extends createZodDto(
  createOrUpdateUserNotificationSettingSchema,
) {}
