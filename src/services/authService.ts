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

    const user = await userRepo.createUser({ 
      email: payload.email, 
      password: hashed,
      firstName: payload?.firstName, 
      lastName: payload?.lastName, 
      phone: payload?.phone,
      role: payload?.role, 
      address1: payload?.address1,
      address2: payload?.address2,
      city: payload?.city,
      state: payload?.state,
      country: payload?.country,
      postalCode: payload?.postalCode,
      placeId: payload?.placeId,
    });

    return { 
      user: { 
        id: user.id, 
        email: payload.email, 
        name: userDisplayName(user),
        role: user?.role,
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
