import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId || (req as any).user?.id);
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
}