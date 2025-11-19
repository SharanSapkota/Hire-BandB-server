import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from "uuid";
import { createRefreshToken } from '../repositories/userRepository';
import argon2 from 'argon2';
import {
  createVerificationToken,
  sendVerificationEmail,
  verifyToken as consumeVerificationToken,
} from './emailVerificationService';
import { hashRefreshToken } from '../utils/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

function calculateAge(dob: string) {
  const birthDate = new Date(dob);
  const now = new Date();
  return now.getFullYear() - birthDate.getFullYear();
}

function userDisplayName(u: any) {
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || null;
}

export async function signup(payload: any) {
  try {
    const existingEmail = await userRepo.findUserByEmail(payload.email);
    if (existingEmail) {
      throw new Error('email_in_use');
    }

    const existingPhone = await userRepo.findUserByPhone(payload.phone);
    if (existingPhone) {
      throw new Error('phone_in_use');
    }

    const hashed = await bcrypt.hash(payload.password, 12);
    const roleCode = (payload?.role ?? 'RENTER').toString().trim().toUpperCase();
    const address = payload?.address ?? {};

    const age = calculateAge(payload.dob);

    const user = await userRepo.createUser({ 
      email: payload.email, 
      password: hashed,
      firstName: payload?.firstName,
      middleName: payload?.middleName,
      lastName: payload?.lastName,
      phone: payload?.phone,
      age,
      roleCode,
      address1: address?.address1 ?? payload?.address1,
      address2: address?.address2 ?? payload?.address2,
      city: address?.city ?? payload?.city,
      state: address?.state ?? payload?.state,
      country: address?.country ?? payload?.country,
      postalCode: address?.postalCode ?? payload?.postalCode,
      placeId: address?.placeId ?? payload?.placeId,
    });

    try {
      const verification = await createVerificationToken(user.id);
      await sendVerificationEmail(payload.email, verification.token);
    } catch (error) {
      console.error('Error sending verification email', error);
    }

    return { 
      user: { 
        id: user.id, 
        email: payload.email, 
        name: userDisplayName(user),
        role: roleCode,
      },
      requiresEmailVerification: true,
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function processRefresh(id: string, token: string) {
  const stored: any = await userRepo.findRefreshTokenById(id);

    if (!stored) {
      throw new Error("Refresh token not found");
    }

    // if (stored.revoked) throw new Error("Refresh token revoked");
    if (stored.expiresAt < new Date()) throw new Error("Refresh token expired");

    const valid = await argon2.verify(stored.tokenHash, token);
    if (!valid) throw new Error("Invalid refresh token");

    // const newPlainToken = uuidv4();
    // const newTokenHash = await argon2.hash(newPlainToken);

    // const newRefresh = await userRepo.createRefreshToken({
    //   userId: stored.userId,
    //   tokenHash: newTokenHash,
    //   expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days
    //   revoked: false,
    // });

    const accessToken = jwt.sign(
      { userId: stored.userId },
      JWT_SECRET,
      { expiresIn: "20m" }
    );

    return {
      accessToken,
      newCookieData: { id: stored.id, token: stored.tokenHash },
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
        sameSite: 'strict',
      },
    };
}

export async function login(payload: { email: string; password: string }) {
  try {
    const user = await userRepo.findUserByEmail(payload.email);
    if (!user) {
      throw new Error('invalid_credentials');
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new Error('invalid_credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('email_not_verified');
    }

    // Get user role
    const role = user.userRoles && user.userRoles.length ? user.userRoles[0].role : null;
    const roleCode = role ? role.code : 'USER';

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: roleCode,
        email: payload.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Get primary email
    const primaryEmail = user.emails && user.emails.length 
      ? (user.emails.find((e: any) => e.isPrimary)?.email || user.emails[0].email) 
      : payload.email;

    return { 
      user: { 
        id: user.id, 
        email: primaryEmail, 
        name: userDisplayName(user),
        role: roleCode
      }, 
      token 
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function verifyEmail(token: string) {
  await consumeVerificationToken(token);
  return { success: true };
}

export async function resendVerification(email: string) {
  const user = await userRepo.findUserByEmail(email);
  if (!user) {
    throw new Error('user_not_found');
  }

  if (user.isEmailVerified) {
    return { alreadyVerified: true };
  }

  const primaryEmail = user.emails?.find((e: any) => e.isPrimary) || user.emails?.[0];
  const targetEmail = primaryEmail?.email || email;

  const verification = await createVerificationToken(user.id);
  await sendVerificationEmail(targetEmail, verification.token);

  return { success: true };
}

export async function forgotPassword(email: string) {
  const user = await userRepo.findUserByEmail(email);
  if (!user) {
    throw new Error('user_not_found');
  }

  const primaryEmail = user.emails?.find((e: any) => e.isPrimary) || user.emails?.[0];
  const targetEmail = primaryEmail?.email || email;

  const { createPasswordResetToken, sendPasswordResetEmail } = await import('./passwordResetService');
  const resetToken = await createPasswordResetToken(user.id);
  await sendPasswordResetEmail(targetEmail, resetToken.token);

  return { success: true };
}

export async function revokeRefreshToken(id: string, reason: string) {
  return await userRepo.revokeRefreshToken(id, reason);
}

export async function loginV2(payload: { email: string; password: string }) {
  try {
    const user = await userRepo.findUserByEmail(payload.email);
    if (!user) {
      throw new Error('user_not_found');
    }
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new Error('invalid_credentials');
    }

    if (!user.isEmailVerified) {
      throw new Error('email_not_verified');
    }

    // Get user role
    const role = user.userRoles && user.userRoles.length ? user.userRoles[0].role : null;
    const roleCode = role ? role.code : 'USER';

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: roleCode,
        email: payload.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '20m' }
    );

    const refreshId = uuidv4();
    const refreshPlain = uuidv4() + "." + uuidv4();
  
    const tokenHash = await hashRefreshToken(refreshPlain);
    await createRefreshToken({
      id: refreshId,
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days
      revoked: false,
    });

    // Get primary email
    const primaryEmail = user.emails && user.emails.length 
      ? (user.emails.find((e: any) => e.isPrimary)?.email || user.emails[0].email) 
      : payload.email;

    return {
      settingHttpCookie: JSON.stringify({ id: refreshId, token: refreshPlain }),
      user: { 
        id: user.id, 
        email: primaryEmail, 
        name: userDisplayName(user),
        role: roleCode
      }, 
      token 
    }
  } catch (error: any) {
    console.error('LoginV2 error:', error);
    throw error;
  }
}