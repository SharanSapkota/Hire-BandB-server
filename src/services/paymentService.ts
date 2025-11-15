import * as payRepo from '../repositories/paymentRepository';
import { PaymentServiceAdapter } from './payment/adapter';
import { StripePaymentService } from './payment/stripePayment';

export class PaymentService {
  private paymentServiceAdapter: PaymentServiceAdapter;
  constructor() {
    this.paymentServiceAdapter = new PaymentServiceAdapter(new StripePaymentService());
  }
  async createPaymentTransaction(data: any) {
    return await this.paymentServiceAdapter.createPaymentTransaction(data);
  }
  async listPaymentMethods() {
    return payRepo.findAllPaymentMethods();
  }
  
  async getPaymentMethod(id: number) {
    return payRepo.findPaymentMethodById(id);
  }
  
  async createPaymentMethod(data: any) {
    return payRepo.createPaymentMethod(data);
  }
  
  async updatePaymentMethod(id: number, data: any) {
    return payRepo.updatePaymentMethod(id, data);
  }
}
