import * as userRepo from '../repositories/userRepository';
export class UserService {
  async getUserById(userId: number) {
    return userRepo.findUserById(userId);
  }

  async createUserPaymentMode(data: { type: string, name: string, isVerified: boolean, userId: number, accountNumber?: string, verificationMethod?: string, customerId?: string }) {
    return userRepo.createUserPaymentMode(data);
  }

  async getUserPaymentModeByCustomerId(customerId: string) {
    return userRepo.getUserPaymentModeByCustomerId(customerId);
  }

  async updateUserPaymentMode(id: string, data: { isVerified: boolean }) {
    return userRepo.updateUserPaymentMode(id, data);
  }
}