import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

function userDisplayName(u: any) {
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || null;
}

export async function signup(payload: any) {
  try {
    const existing = await userRepo.findUserByEmail(payload.email);
    if (existing) {
      throw new Error('email_in_use');
    }

    const hashed = await bcrypt.hash(payload.password, 12);
    const roleCode = (payload?.role ?? 'RENTER').toString().trim().toUpperCase();
    const address = payload?.address ?? {};

    let age: number | undefined;
    if (payload?.dob) {
      const birthDate = new Date(payload.dob);
      if (!Number.isNaN(birthDate.getTime())) {
        const now = new Date();
        age = now.getFullYear() - birthDate.getFullYear();
        const hasHadBirthday =
          now.getMonth() > birthDate.getMonth() ||
          (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
        if (!hasHadBirthday) {
          age = age - 1;
        }
      }
    }

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

    return { 
      user: { 
        id: user.id, 
        email: payload.email, 
        name: userDisplayName(user),
        role: roleCode,
      }, 
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function login(payload: { email: string; password: string }) {
  try {
    // Find user by email
    const user = await userRepo.findUserByEmail(payload.email);
    if (!user) {
      throw new Error('invalid_credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new Error('invalid_credentials');
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
