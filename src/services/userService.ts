import * as userRepo from '../repositories/userRepository';
export class UserService {
  async getUserById(userId: number) {
    return userRepo.findUserById(userId);
  }
}