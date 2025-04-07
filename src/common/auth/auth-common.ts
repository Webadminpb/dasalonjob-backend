import { Auth } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export async function generateJwtToken(user: Auth) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      countryId: user?.countryId,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_Expiry ?? '1d' },
  );
}
