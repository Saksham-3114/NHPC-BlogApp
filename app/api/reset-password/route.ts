import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateResetToken, hashPassword } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Validate the reset token
    const validation = await validateResetToken(token);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user's password and delete the reset token
    await db.$transaction([
      db.user.update({
        where: { id: validation.user!.id },
        data: { password: hashedPassword },
      }),
      db.passwordResetToken.delete({
        where: { id: validation.tokenId },
      }),
    ]);

    return NextResponse.json({
      message: 'Password reset successfully',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}