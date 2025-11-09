import * as userRepo from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

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
