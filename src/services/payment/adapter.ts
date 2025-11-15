import { BasePaymentService, PaymentService } from "./base";
import { StripePaymentService } from "./stripePayment";

export class PaymentServiceAdapter implements BasePaymentService {
    constructor(private paymentService: PaymentService) {}
    async createPaymentTransaction(data: any): Promise<any> {
        if(this.paymentService instanceof StripePaymentService) {
            return this.paymentService.createPaymentTransaction(data);
        }
        throw new Error("Payment service not supported");
    }
}

