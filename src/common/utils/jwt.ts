import { Auth } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'qazxswedcrfvbgtnhy';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'qazyswedcrrvbgtnhy';

const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '1d';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export async function generateJwtToken(user: Auth) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      countryId: user?.countryId,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_Expiry ?? '1y' },
  );
}

export async function generateAccessToken(payload: any) {
  console.log('payload ', payload);
  const expiresIn = ACCESS_EXPIRY;
  const options = { expiresIn };
  const token = jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    ACCESS_SECRET,
    options,
  );

  const decoded = jwt.decode(token) as { exp?: number };
  const expiry = decoded?.exp ? new Date(decoded.exp * 1000) : null;
  return { token, expiry };
}

export async function generateRefreshToken(payload: Auth) {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY },
  );
}

export async function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export async function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
