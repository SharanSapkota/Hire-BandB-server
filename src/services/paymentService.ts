import * as payRepo from '../repositories/paymentRepository';
import { CostCalculator } from './costCalculator/costCalculator';
import { PaymentMethodService } from './payment/payment';
import { StripePaymentService } from './payment/stripePayment';
import { BikeService } from './bikeService/bikeService';
import { BikeRepository } from '../repositories/bikeRepository';
import * as bookingService from './bookingService';

export class PaymentService {
  private paymentMethodService: PaymentMethodService;
  private costCalculator: CostCalculator;
  private bikeService: BikeService;
  constructor() {
    this.paymentMethodService = new PaymentMethodService(new StripePaymentService());
    this.costCalculator = new CostCalculator();
    this.bikeService = new BikeService(new BikeRepository());
  }

  async createPaymentTransaction(data: any) {
    const booking = await bookingService.getBookingById(data.bookingId);
    if(!booking) {
      throw new Error('Booking not found');
    }
    const calculatedCost = await this.calculateCostForRenter({bikeId: booking.bikeId, fromDate: booking.startTime, toDate: booking.endTime});
    if(!calculatedCost) {
      throw new Error('Cost calculation failed');
    }
  
    return await this.paymentMethodService.createPaymentTransaction({bookingId: booking.id, amount: calculatedCost});
  }

  async listPaymentMethods() {
    return payRepo.findAllPaymentMethods();
  }

  async calculateCostForRenter(data: any) {
    const bike = await this.bikeService.getBikeById(data);
    return this.costCalculator.calculateCostForRenter({bike, fromDate: data.fromDate, toDate: data.toDate});
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
