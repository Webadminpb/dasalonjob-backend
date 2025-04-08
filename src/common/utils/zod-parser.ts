import { ZodSchema } from 'zod';

export function parseWithSchema<T extends ZodSchema<any>>(
  schema: T,
  data: unknown,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('Zod Validation Error:', result.error);
    throw new Error('Invalid response structure');
  }
  return result.data;
}
