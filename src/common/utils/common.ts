export async function generateSixDigitOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const getPaginationTake = (limit: number | undefined) => {
  return limit ? Number(limit) : undefined;
};

export const getPaginationSkip = (
  page: number | string | undefined,
  limit: number | string | undefined,
) => {
  return page && limit ? (Number(page) - 1) * Number(limit) : undefined;
};

export const getSortOrder = (order?: string) => {
  return order === 'asc' ? 'asc' : 'desc';
};

export const getSortBy = (sort?: string) => {
  return sort || 'createdAt';
};

export function generateRandomPassword(length: number = 8): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}
