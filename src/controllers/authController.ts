import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { sendFailure, sendSuccess } from '../utils/response';

export async function signup(req: Request, res: Response) {
  try {
    const result = await authService.signup(req.body);
    return sendSuccess(res, result, 200);
  } catch (err: any) {
    console.error('Signup controller error:', err);
    
    if (err.message === 'email_in_use') {
      return sendFailure(res, 'Email already in use', 400);
    }
    
    if (err.message === 'default_role_not_found') {
      return sendFailure(res, 'System configuration error', 500);
    }

    if (err.message === 'role_not_found') {
      return sendFailure(res, 'Invalid role selected', 400);
    }

    return sendFailure(res, err.message ?? 'An unexpected error occurred during signup', 500);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result);
  } catch (err: any) {
    console.error('Login controller error:', err);
    
    if (err.message === 'invalid_credentials') {
      sendFailure(res, 'Invalid credentials', 401);
      return;
    }

    if (err.message === 'email_not_verified') {
      sendFailure(res, 'Please verify your email before logging in', 403);
      return;
    }
 
    sendFailure(res, 'An unexpected error occurred during login', 500);
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.body;
    if (!token) {
      return sendFailure(res, 'Verification token is required', 400);
    }

    await authService.verifyEmail(token);
    return sendSuccess(res, { verified: true }, 200);
  } catch (error: any) {
    console.error('verifyEmail error:', error);

    if (error.message === 'invalid_token') {
      return sendFailure(res, 'Invalid verification token', 400);
    }

    if (error.message === 'token_already_used') {
      return sendFailure(res, 'This verification link has already been used', 400);
    }

    if (error.message === 'token_expired') {
      return sendFailure(res, 'Verification link has expired', 400);
    }

    return sendFailure(res, 'Could not verify email', 500);
  }
}

export async function resendVerification(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return sendFailure(res, 'Email is required', 400);
    }

    const result = await authService.resendVerification(email);

    if (result.alreadyVerified) {
      return sendSuccess(res, { alreadyVerified: true }, 200);
    }

    return sendSuccess(res, { sent: true }, 200);
  } catch (error: any) {
    console.error('resendVerification error:', error);

    if (error.message === 'user_not_found') {
      return sendFailure(res, 'No account found for that email', 404);
    }

    return sendFailure(res, 'Could not resend verification email', 500);
  }
}
