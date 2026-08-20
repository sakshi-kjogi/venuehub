import bcrypt from 'bcrypt';
import { env } from '@/config/env';

export async function hashValue(plain: string): Promise<string> {
  return bcrypt.hash(plain, env.bcryptSaltRounds);
}

export async function compareValue(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}