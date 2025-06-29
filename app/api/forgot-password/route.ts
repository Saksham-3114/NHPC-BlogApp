import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createPasswordResetToken } from '@/lib/auth-utils';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists, a reset email has been sent',
      });
    }

    // Create reset token
    const token = await createPasswordResetToken(user.id);

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json({
      message: 'If an account exists, a reset email has been sent',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}