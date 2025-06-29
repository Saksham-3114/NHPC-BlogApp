import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour

  // Delete any existing tokens for this user
  await db.passwordResetToken.deleteMany({
    where: { userId }
  });

  // Create new token
  await db.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function validateResetToken(token: string) {
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken) {
    return { valid: false, error: 'Invalid token' };
  }

  if (resetToken.expiresAt < new Date()) {
    // Clean up expired token
    await db.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    return { valid: false, error: 'Token expired' };
  }

  return { valid: true, user: resetToken.user, tokenId: resetToken.id };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}