import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { sendFailure, sendSuccess } from '../utils/response';

export async function signup(req: Request, res: Response) {
  try {
    const result = await authService.signup(req.body);
    sendSuccess(res, result);
  } catch (err: any) {
    console.error('Signup controller error:', err);
    
    if (err.message === 'email_in_use') {
        sendFailure(res, 'Email already in use', 400);
    }
    
    if (err.message === 'default_role_not_found') {
      sendFailure(res, 'System configuration error', 500);
    }
    sendFailure(res, 'An unexpected error occurred during signup', 500);
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
    }
    
    sendFailure(res, 'An unexpected error occurred during login', 500);
  }
}
