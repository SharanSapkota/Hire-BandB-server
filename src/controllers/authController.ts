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

    return sendFailure(res, 'An unexpected error occurred during signup', 500);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, 200);
  } catch (err: any) {
    console.error('Login controller error:', err);
    
    if (err.message === 'invalid_credentials') {
      return sendFailure(res, 'Invalid credentials', 401);
    }
    
    return sendFailure(res, 'An unexpected error occurred during login', 500);
  }
}
