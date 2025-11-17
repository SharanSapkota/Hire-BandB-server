import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { sendFailure, sendSuccess } from '../utils/response';
import { userPresenter } from '../presentation/user';

const userService = new UserService();

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId || (req as any).user?.id);
    const user = await userService.getUserById(userId);
    const presentableUser = userPresenter(user);

    return sendSuccess(res, presentableUser, 200);
  } catch (error) {
    return sendFailure(res, { error: 'Failed to get user' }, 500);
  }
}