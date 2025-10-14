import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function signup(req: Request, res: Response) {
  try {
    const result = await authService.signup(req.body);
    res.json(result);
  } catch (err: any) {
    if (err.message === 'email_in_use') return res.status(400).json({ error: 'email already in use' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err: any) {
    if (err.message === 'invalid_credentials') return res.status(401).json({ error: 'invalid credentials' });
    console.error(err);
    res.status(500).json({ error: 'internal error' });
  }
}
