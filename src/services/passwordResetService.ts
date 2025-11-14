import crypto from 'crypto';
import prisma from '../prisma';
import { sendEmail } from '../utils/mailer';
import bcrypt from 'bcrypt';
import { FRONTEND_URL } from '../config/app.config';

const TOKEN_EXPIRATION_HOURS = Number(process.env.PASSWORD_RESET_EXPIRATION_HOURS || 1);

function buildResetUrl(token: string) {
  const base = FRONTEND_URL.replace(/\/$/, '');
  return `${base}/reset-password?token=${token}`;
}

export async function createPasswordResetToken(userId: number) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);

  // Delete any existing unused tokens for this user
  await prisma.passwordReset.deleteMany({ where: { userId, usedAt: null } });

  return prisma.passwordReset.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = buildResetUrl(token);
  const subject = 'Reset your password';
  const html = `
    <p>Hello,</p>
    <p>You requested to reset your password for your Gear Quest account.</p>
    <p>Click the button below to reset your password:</p>
    <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#0f766e;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
    <p>If the button does not work, copy and paste this URL into your browser:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link will expire in ${TOKEN_EXPIRATION_HOURS} hour(s).</p>
    <p>If you did not request this password reset, please ignore this email.</p>
  `;

  await sendEmail({
    to,
    subject,
    html,
    text: `Reset your password: ${resetUrl}`,
  });
}

export async function verifyResetToken(token: string) {
  const record = await prisma.passwordReset.findUnique({ where: { token } });
  if (!record) {
    throw new Error('invalid_token');
  }

  if (record.usedAt) {
    throw new Error('token_already_used');
  }

  if (record.expiresAt.getTime() < Date.now()) {
    throw new Error('token_expired');
  }

  return record;
}

export async function resetPassword(token: string, newPassword: string) {
  const record = await verifyResetToken(token);
  
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.passwordReset.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    }),
  ]);

  return record;
}

