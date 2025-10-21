import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function signup(req: Request, res: Response) {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    console.error('Signup controller error:', err);
    
    if (err.message === 'email_in_use') {
      return res.status(400).json({ 
        success: false,
        error: 'Email already in use',
        message: 'An account with this email already exists'
      });
    }
    
    if (err.message === 'default_role_not_found') {
      return res.status(500).json({ 
        success: false,
        error: 'System configuration error',
        message: 'Default user role not found'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred during signup'
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err: any) {
    console.error('Login controller error:', err);
    
    if (err.message === 'invalid_credentials') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred during login'
    });
  }
}
