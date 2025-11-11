import crypto from 'crypto';
import prisma from '../prisma';
import { sendEmail } from '../utils/mailer';

const TOKEN_EXPIRATION_HOURS = Number(process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS || 24);
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:8080';

function buildVerificationUrl(token: string) {
  const base = APP_BASE_URL.replace(/\/$/, '');
  return `${base}/verify-email?token=${token}`;
}

export async function createVerificationToken(userId: number) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);

  await prisma.emailVerification.deleteMany({ where: { userId, usedAt: null } });

  return prisma.emailVerification.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const verificationUrl = buildVerificationUrl(token);
  const subject = 'Verify your email address';
  const html = `
    <p>Hello,</p>
    <p>Thanks for signing up with Gear Quest. Please verify your email address by clicking the button below:</p>
    <p><a href="${verificationUrl}" style="display:inline-block;padding:10px 16px;background:#0f766e;color:#fff;text-decoration:none;border-radius:6px;">Verify email</a></p>
    <p>If the button does not work, copy and paste this URL into your browser:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>This link will expire in ${TOKEN_EXPIRATION_HOURS} hours.</p>
  `;

  await sendEmail({
    to,
    subject,
    html,
    text: `Verify your email address: ${verificationUrl}`,
  });
}

export async function markEmailAsVerified(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { isEmailVerified: true },
  });

  await prisma.userEmail.updateMany({
    where: { userId, isPrimary: true },
    data: { isVerified: true },
  });
}

export async function verifyToken(token: string) {
  const record = await prisma.emailVerification.findUnique({ where: { token } });
  if (!record) {
    throw new Error('invalid_token');
  }

  if (record.usedAt) {
    throw new Error('token_already_used');
  }

  if (record.expiresAt.getTime() < Date.now()) {
    throw new Error('token_expired');
  }

  await prisma.$transaction([
    prisma.emailVerification.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: { isEmailVerified: true },
    }),
    prisma.userEmail.updateMany({
      where: { userId: record.userId, isPrimary: true },
      data: { isVerified: true },
    }),
  ]);

  return record;
}
